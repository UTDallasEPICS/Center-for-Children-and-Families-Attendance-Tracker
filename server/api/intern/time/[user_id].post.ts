export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const userID = event.context.params?.user_id as string
    const { check_in_type, check_in_code } = body

    const now = new Date()

    // current hour and minute for shift comparison
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // calculate start and end of today
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    // find today's scheduled shifts
    const todaysShifts = await prisma.scheduled_day.findMany({
        where: {
            userID: userID,
            date: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        include: {
            site: true
        }
    })

    if (todaysShifts.length === 0) {

        console.error("No scheduled shift found for today for user:", userID)

        throw createError({
            statusCode: 404,
            statusMessage: "No scheduled shift for today"
        })
    }

    // find the shift matching current time
    const activeShift = todaysShifts.find(shift =>
        currentHour >= shift.shift_start && currentHour <= shift.shift_end
    )

    if (!activeShift) {

        console.error("Current time does not fall within any scheduled shift for user:", userID)

        throw createError({
            statusCode: 400,
            statusMessage: "User is not scheduled to work at this time"
        })
    }

    // Prevent clock-in more than 10 minutes before shift start
    if (check_in_type) {

        const shiftStartHour = activeShift.shift_start
        const minutesUntilShift = (shiftStartHour - currentHour) * 60 - currentMinute

        if (minutesUntilShift > 10) {

            console.error("User attempted to check in too early:", userID)

            throw createError({
                statusCode: 400,
                statusMessage: "Cannot check in more than 10 minutes before shift start"
            })
        }
    }

    // Verify attendance code
    if (check_in_type) {

        if (!check_in_code || check_in_code !== activeShift.site.attendance_code) {

            console.error("Invalid attendance code for user:", userID)

            throw createError({
                statusCode: 403,
                statusMessage: "Invalid attendance code"
            })
        }

        // create attendance record
        const attendance = await prisma.attendance.create({
            data: {
                userID: userID,
                clock_in_time: now,
                status: "PRESENT"
            }
        })

        console.log("User checked in:", userID)

        return attendance
    }

    // CHECKOUT LOGIC

    const attendanceRecord = await prisma.attendance.findFirst({
        where: {
            userID: userID,
            clock_in_time: {
                gte: startOfDay,
                lte: endOfDay
            }
        }
    })

    if (!attendanceRecord) {

        console.error("Checkout attempted without check-in for user:", userID)

        throw createError({
            statusCode: 400,
            statusMessage: "Cannot check out before checking in"
        })
    }

    const updatedAttendance = await prisma.attendance.update({
        where: {
            id: attendanceRecord.id
        },
        data: {
            clock_out_time: now
        }
    })

    console.log("User checked out:", userID)

    return updatedAttendance
})