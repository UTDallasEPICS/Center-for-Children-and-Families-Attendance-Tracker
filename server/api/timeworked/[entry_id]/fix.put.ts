export default defineEventHandler(async (event) => {
    const entry_id = event.context.params?.entry_id as string

    if (!entry_id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Entry ID is required"
        })
    }

    const body = await readBody(event)
    const { clock_in_time, clock_out_time, reason } = body

    if (!clock_in_time || !clock_out_time || !reason) {
        throw createError({
            statusCode: 400,
            statusMessage: "clock_in_time, clock_out_time, and reason are required"
        })
    }

    const existing = await prisma.attendance.findUnique({
        where: { id: entry_id }
    })

    if (!existing) {
        throw createError({
            statusCode: 404,
            statusMessage: "Attendance record not found"
        })
    }

    const updated = await prisma.attendance.update({
        where: { id: entry_id },
        data: {
            clock_in_time: new Date(clock_in_time),
            clock_out_time: new Date(clock_out_time),
            reason: reason,
            status: "PRESENT"
        }
    })

    return {
        message: "Attendance record updated successfully",
        updated_entry: updated
    }
})