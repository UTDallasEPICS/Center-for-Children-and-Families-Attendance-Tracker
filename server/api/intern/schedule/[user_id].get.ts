export default defineEventHandler(async (event) => { //Got rid of defineEventHandler import
    // Removed parameter checking
    const userID = event.context.params?.user_id as string

    if (!userID) {
        throw createError({
            statusCode: 400,
            statusMessage: "User ID is required"
        })
    }

    const now = Date.now()

    const attendanceRecords = await prisma.attendance.findMany({
        where: { userID },
        orderBy: { clock_in_time: "asc" }
    })

    const previous_shifts = []
    const future_shifts = []

    attendanceRecords.forEach((record) => {
        const shiftTime = record.clock_in_time
            ? new Date(record.clock_in_time).getTime()
            : null

        const shift = {
            datetime: new Date(shiftTime).toISOString(),
            attendance_status: record.status?.toLowerCase() ?? null,
            clock_in_time: record.clock_in_time,
            clock_out_time: record.clock_out_time
        }

        if (shiftTime < now) {
            previous_shifts.push(shift)
        } else {
            future_shifts.push(shift)
        }
    })

    return {
        attendance_history: {
            previous_shifts,
            future_shifts
        }
    }
})