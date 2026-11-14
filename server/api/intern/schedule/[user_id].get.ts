export default defineEventHandler(async (event) => {
    const internID = event.context.params?.user_id as string

    if (!internID) {
        throw createError({
            statusCode: 400,
            statusMessage: "User ID is required"
        })
    }

    const now = Date.now()

    const attendanceRecords = await prisma.attendance.findMany({
        where: { internID },
        include: {
            scheduled_day: true
        },
        orderBy: {
            scheduled_day: {
                start_time: "asc"
            }
        }
    })

    const previous_shifts = []
    const future_shifts = []

    attendanceRecords.forEach((record) => {
        // Use the scheduled shift date, NOT the clock-in time
        const shiftTime = new Date(
            record.scheduled_day.start_time
        ).getTime()

        const shift = {
            datetime: record.scheduled_day.start_time.toISOString(),
            start_time: record.scheduled_day.start_time,
            end_time: record.scheduled_day.end_time,
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