// seed.ts
// Run this with: npx prisma db seed
// It sets up some baseline data so we're not starting from a completely empty
// database every time we reset migrations during development.

import { PrismaClient, Attendance_status } from '../prisma/generated/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  // --- Admin ---
  // Just one admin account for now, enough to test the admin-only pages
  const admin = await prisma.admin.upsert({
    where: { id: 'admin-seed-001' },
    update: {},
    create: {
      id: 'admin-seed-001',
      name: 'Admin User',
      email: 'admin@utdallas.edu',
    },
  })
  console.log('created admin:', admin.email)

  // --- Location ---
  // One real-ish site so the location dropdown and site overview page have something to show
  const location = await prisma.location.upsert({
    where: { id: 'location-seed-001' },
    update: {},
    create: {
      id: 'location-seed-001',
      location_name: 'UTD Play With Me - Site A',
      address: '800 W Campbell Rd, Richardson, TX 75080',
      // no active attendance code by default, the site manager would generate one
      attendance_code: null,
      code_expires_at: null,
    },
  })
  console.log('created location:', location.location_name)

  // --- Regular intern ---
  const intern = await prisma.intern.upsert({
    where: { id: 'intern-seed-001' },
    update: {},
    create: {
      id: 'intern-seed-001',
      user_name: 'Jane Doe',
      user_email: 'jane.doe@utdallas.edu',
      user_phone: '555-100-0001',
    },
  })
  console.log('created intern:', intern.user_name)

  // --- Site manager ---
  // Site managers are also interns in the schema — they get an intern record first,
  // then a separate Site_Manager record that links them to a location
  const managerIntern = await prisma.intern.upsert({
    where: { id: 'intern-seed-002' },
    update: {},
    create: {
      id: 'intern-seed-002',
      user_name: 'John Smith',
      user_email: 'john.smith@utdallas.edu',
      user_phone: '555-100-0002',
    },
  })

  await prisma.site_Manager.upsert({
    where: { id: 'manager-seed-001' },
    update: {},
    create: {
      id: 'manager-seed-001',
      intern_ID: managerIntern.id,
      locations: {
        connect: { id: location.id },
      },
    },
  })
  console.log('created site manager:', managerIntern.user_name)

  // --- Scheduled days ---
  // We need a spread of past shifts to attach attendance records to,
  // plus one upcoming shift so next_shift_ID has somewhere to point.
  // Shifts run 9 AM - 12 PM CDT (15:00-18:00 UTC).
  const now = new Date()

  const daysAgo = (n: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - n)
    return d
  }

  const daysAhead = (n: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() + n)
    return d
  }

  const shiftStart = (base: Date) => {
    const d = new Date(base)
    d.setUTCHours(15, 0, 0, 0)
    return d
  }

  const shiftEnd = (base: Date) => {
    const d = new Date(base)
    d.setUTCHours(18, 0, 0, 0)
    return d
  }

  // one shift per attendance status we need to cover, plus an upcoming one
  const shiftDates = [
    daysAgo(28),  // will be ABSENT
    daysAgo(21),  // will be CALLED_OFF
    daysAgo(14),  // will be PRESENT
    daysAgo(7),   // will be used for the fulfilled shift swap
    daysAhead(7), // upcoming shift
  ]

  const scheduledDays = await Promise.all(
    shiftDates.map((base, i) =>
      prisma.scheduled_day.upsert({
        where: { id: `shift-seed-00${i + 1}` },
        update: {},
        create: {
          id: `shift-seed-00${i + 1}`,
          start_time: shiftStart(base),
          end_time: shiftEnd(base),
          site_ID: location.id,
        },
      })
    )
  )
  console.log('created scheduled days:', scheduledDays.length)

  // --- Intern attendance history ---
  // Need all four statuses represented so we can test every branch in the UI
  const internAttendanceRecords = [
    {
      id: 'att-intern-001',
      shiftIdx: 0,
      status: Attendance_status.ABSENT,
      clock_in_time: null,
      clock_out_time: null,
    },
    {
      id: 'att-intern-002',
      shiftIdx: 1,
      status: Attendance_status.CALLED_OFF,
      clock_in_time: null,
      clock_out_time: null,
    },
    {
      id: 'att-intern-003',
      shiftIdx: 2,
      status: Attendance_status.PRESENT,
      clock_in_time: shiftStart(shiftDates[2]),
      clock_out_time: shiftEnd(shiftDates[2]),
    },
    // COVERING_SHIFT gets added below alongside the fulfilled shift request
  ]

  for (const rec of internAttendanceRecords) {
    await prisma.attendance.upsert({
      where: { id: rec.id },
      update: {},
      create: {
        id: rec.id,
        status: rec.status,
        clock_in_time: rec.clock_in_time,
        clock_out_time: rec.clock_out_time,
        internID: intern.id,
        shift_ID: scheduledDays[rec.shiftIdx].id,
      },
    })
  }
  console.log('created intern attendance history')

  // --- Site manager attendance history ---
  // Same idea — cover all four statuses for the manager too
  const managerAttendanceRecords = [
    {
      id: 'att-mgr-001',
      shiftIdx: 0,
      status: Attendance_status.ABSENT,
      clock_in_time: null,
      clock_out_time: null,
    },
    {
      id: 'att-mgr-002',
      shiftIdx: 1,
      status: Attendance_status.CALLED_OFF,
      clock_in_time: null,
      clock_out_time: null,
    },
    {
      id: 'att-mgr-003',
      shiftIdx: 2,
      status: Attendance_status.PRESENT,
      clock_in_time: shiftStart(shiftDates[2]),
      clock_out_time: shiftEnd(shiftDates[2]),
    },
    // COVERING_SHIFT added below with the fulfilled request
  ]

  for (const rec of managerAttendanceRecords) {
    await prisma.attendance.upsert({
      where: { id: rec.id },
      update: {},
      create: {
        id: rec.id,
        status: rec.status,
        clock_in_time: rec.clock_in_time,
        clock_out_time: rec.clock_out_time,
        internID: managerIntern.id,
        shift_ID: scheduledDays[rec.shiftIdx].id,
      },
    })
  }
  console.log('created site manager attendance history')

  // --- Fulfilled shift request ---
  // Jane had a shift 7 days ago and asked someone to cover it.
  // John picked it up, so his attendance shows COVERING_SHIFT and Jane's shows CALLED_OFF.
  const fulfilledRequest = await prisma.shift_Request.upsert({
    where: { id: 'shift-req-fulfilled-001' },
    update: {},
    create: {
      id: 'shift-req-fulfilled-001',
      reason: "Doctor's appointment, can't make it",
      created_by_ID: intern.id,
      picked_up_by_ID: managerIntern.id,
    },
  })

  // Jane's side of the swap — she called off
  await prisma.attendance.upsert({
    where: { id: 'att-intern-004' },
    update: {},
    create: {
      id: 'att-intern-004',
      status: Attendance_status.CALLED_OFF,
      clock_in_time: null,
      clock_out_time: null,
      internID: intern.id,
      shift_ID: scheduledDays[3].id,
      shift_request_ID: fulfilledRequest.id,
    },
  })

  // John's side — he covered the shift
  await prisma.attendance.upsert({
    where: { id: 'att-mgr-004' },
    update: {},
    create: {
      id: 'att-mgr-004',
      status: Attendance_status.COVERING_SHIFT,
      clock_in_time: shiftStart(shiftDates[3]),
      clock_out_time: shiftEnd(shiftDates[3]),
      internID: managerIntern.id,
      shift_ID: scheduledDays[3].id,
      shift_request_ID: fulfilledRequest.id,
    },
  })
  console.log('created fulfilled shift request')

  // --- Pending shift request ---
  // Jane also wants someone to cover her upcoming shift but nobody has taken it yet.
  // picked_up_by_ID stays null until another intern claims it.
  const pendingRequest = await prisma.shift_Request.upsert({
    where: { id: 'shift-req-pending-001' },
    update: {},
    create: {
      id: 'shift-req-pending-001',
      reason: 'Family event conflict',
      created_by_ID: intern.id,
      picked_up_by_ID: null,
    },
  })

  await prisma.attendance.upsert({
    where: { id: 'att-intern-005' },
    update: {},
    create: {
      id: 'att-intern-005',
      status: Attendance_status.ABSENT,
      clock_in_time: null,
      clock_out_time: null,
      internID: intern.id,
      shift_ID: scheduledDays[4].id,
      shift_request_ID: pendingRequest.id,
    },
  })
  console.log('created pending shift request')

  // --- Next shift pointers ---
  // Point both users at the upcoming shift so the dashboard has something to display
  await prisma.intern.update({
    where: { id: intern.id },
    data: { next_shift_ID: scheduledDays[4].id },
  })

  await prisma.intern.update({
    where: { id: managerIntern.id },
    data: { next_shift_ID: scheduledDays[4].id },
  })
  console.log('linked next shift for intern and site manager')

  console.log('done')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  //new text so i can recommit the changes