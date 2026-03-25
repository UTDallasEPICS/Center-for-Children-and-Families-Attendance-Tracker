export default defineEventHandler(async (event) => {

    const userID = event.context.params?.user_id as string

    const now = new Date()

    type Shift = {
        datetime: string
        site: string
        attendance_status: string | null
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

    schedules.forEach((shift: any) => {

        const shiftDate = new Date(shift.date)

        const shiftStart = new Date(shift.date)
        const shiftEnd = new Date(shift.date)
        shiftEnd.setMinutes(shiftEnd.getMinutes() + shift.shift_duration)

        const attendance = attendanceRecords.find((record: any) => {
            if (!record.clock_in_time) return false

            const recordTime = new Date(record.clock_in_time)

            return recordTime >= shiftStart && recordTime <= shiftEnd
        })

        let attendance_status: string | null = null

        if (attendance) {
            attendance_status = attendance.status.toLowerCase()
        }

        const shiftData: Shift = {
            datetime: shiftDate.toISOString(),
            site: shift.site_ID,
            attendance_status
        }

        if (shiftDate < now) {
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