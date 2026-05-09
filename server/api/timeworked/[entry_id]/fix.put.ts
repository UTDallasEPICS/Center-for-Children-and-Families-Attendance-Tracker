export default defineEventHandler(async (event) => {
  const entry_id = event.context.params?.entry_id as string

  if (!entry_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Entry ID is required"
    })
  }

  const body = await readBody(event)
  const { clock_in_time, clock_out_time } = body

  if (!clock_in_time || !clock_out_time) {
    throw createError({
      statusCode: 400,
      statusMessage: "clock_in_time and clock_out_time are required"
    })
  }

  const updated = await prisma.attendance.update({
    where: { id: entry_id },
    data: {
      clock_in_time: new Date(clock_in_time),
      clock_out_time: new Date(clock_out_time),
      status: "PRESENT"
    }
  })

  return updated
})