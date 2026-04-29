export default defineEventHandler(async (event) => {
    const userID = event.context.params?.user_id as string

    if (!userID) {
        throw createError({
            statusCode: 400,
            statusMessage: "User ID is required"
        })
    }

    const curr_date = Date.now()

    type Shift = {
        datetime: string
        site: string
        attendance_status: string | null
        clock_in_time?: string | null
        clock_out_time?: string | null
    }

    const previous_shifts: Shift[] = []
    const future_shifts: Shift[] = []

    const schedules = await prisma.scheduled_day.findMany({
        where: {
            userID: userID
        },
        include: {
            site: true
        },
        orderBy: {
            date: "asc"
        }
    })

    const attendanceRecords = await prisma.attendance.findMany({
        where: {
            userID: userID
        }
    })

    schedules.forEach((shift) => {
        const shiftTime = new Date(shift.date).getTime()

        const attendance = attendanceRecords.find((record) => {
            if (!record.clock_in_time) return false

            const clockIn = new Date(record.clock_in_time).getTime()
            return Math.abs(clockIn - shiftTime) < 86400000
        })

        let attendance_status: string | null = null

        if (attendance) {
            attendance_status = attendance.status.toLowerCase()
        }

        const shiftData: Shift = {
            datetime: new Date(shiftTime).toISOString(),
            site: shift.site_ID,
            attendance_status
        }

        if (shiftTime < curr_date) {
            previous_shifts.push({
                ...shiftData,
                attendance_status: attendance_status || "absent"
            })
        } else {
            future_shifts.push(shiftData)
        }
    })

    return {
        attendance_history: {
            previous_shifts,
            future_shifts
        }
    }
})