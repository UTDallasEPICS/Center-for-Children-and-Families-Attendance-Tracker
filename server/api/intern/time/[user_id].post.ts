export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userID = event.context.params?.user_id as string
  const { check_in_type, check_in_code } = body
  const curr_date = new Date()

  const intern = await prisma.intern.findUnique({
    where: { id: userID },
    include: { next_shift: true }
  })

  let activeShift = intern?.next_shift ?? null

  if (activeShift) {
    if (curr_date < activeShift.start_time || curr_date > activeShift.end_time) {
      activeShift = null
    }
  }

  if (check_in_type && activeShift?.site?.attendance_code !== check_in_code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid attendance code"
    })
  }

  let attendance = await prisma.attendance.findFirst({
    where: {
      internID: userID,
      shift_ID: intern?.next_shift_ID
    }
  })

  if (check_in_type) {
    attendance = await prisma.attendance.upsert({
      where: {
        internID_shift_ID: {
          internID: userID,
          shift_ID: intern?.next_shift_ID!
        }
      },
      create: {
        internID: userID,
        shift_ID: intern?.next_shift_ID!,
        clock_in_time: curr_date,
        status: "PRESENT"
      },
      update: {
        clock_in_time: curr_date,
        status: "PRESENT"
      }
    })
  } else {
    if (!attendance?.clock_in_time) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot check out before checking in"
      })
    }

    attendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { clock_out_time: curr_date }
    })
  }

  return attendance
})