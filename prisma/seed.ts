import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../app/generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaBetterSqlite3({ url: connectionString })

const prisma = new PrismaClient({ adapter })

const testInternId = process.env.TEST_INTERN_ID
const testSiteManagerId = process.env.TEST_SITE_MANAGER_ID
const testAdminId = process.env.TEST_ADMIN_ID

async function main() {
  // create location
  const day1Start = "2026-05-04T19:00:00.000Z"
  const day1End = "2026-05-04T21:00:00.000Z"
  const day2Start = "2026-05-13T19:00:00.000Z"
  const day2End = "2026-05-13T21:00:00.000Z"
  await prisma.location.upsert({
    where: {
      id: '0'
    },
    update: {},
    create: {
      id: '0',
      location_name: "Location 0",
      address: "Address 0",
      scheduled_days: {
        connectOrCreate: [
          {
            where: {
              id: '0'
            },
            create: {
              id: '0',
              start_time: new Date(day1Start),
              end_time: new Date(day1End),
            }
          },
          {
            where: {
              id: '1'
            },
            create: {
              id: '1',
              start_time: new Date(day2Start),
              end_time: new Date(day2End),
            }
          },
        ]
      }
    }
  })

  await prisma.$transaction([
    prisma.intern.upsert({
      where: {
        id: testSiteManagerId
      },
      update: {},
      create: {
        id: testSiteManagerId,
        user_name: 'Manager Bro',
        user_email: 'manager@gmail.com',
        user_phone: '1234567890',
        next_shift_ID: '1',
        attendance_history: {
          connectOrCreate: [
            {
              where: {
                id: '0'
              },
              create: {
                id: '0',
                clock_in_time: new Date(day1Start),
                clock_out_time: new Date(day1End),
                status: 'PRESENT',
                shift_ID: '0'
              }
            },
            {
              where: {
                id: '1'
              },
              create: {
                id: '1',
                shift_ID: '1'
              }
            }
          ]
        },
        site_manager: {
          connectOrCreate: {
            where: {
              id: testSiteManagerId,
            },
            create: {
              id: testSiteManagerId,
              locations: {
                connect: [{
                  id: '0'
                }]
              }
            }
          }
        }
      }
    }),
    prisma.intern.upsert({
      where: {
        id: testInternId
      },
      update: {},
      create: {
        id: testInternId,
        user_name: 'Dude Bro',
        user_email: 'example@gmail.com',
        user_phone: '1234567890',
        next_shift_ID: '1',
        attendance_history: {
          connectOrCreate: [
            {
              where: {
                id: '0'
              },
              create: {
                id: '0',
                clock_in_time: new Date(day1Start),
                clock_out_time: new Date(day1End),
                status: 'PRESENT',
                shift_ID: '0'
              }
            },
            {
              where: {
                id: '1'
              },
              create: {
                id: '1',
                shift_ID: '1'
              }
            }
          ]
        }
      }
    })
  ])

  await prisma.admin.upsert({
    where: {
      id: '0'
    },
    update: {},
    create: {
      id: '0',
      name: 'Admin Bro',
      email: 'admin@example.com'
    }
  })
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
