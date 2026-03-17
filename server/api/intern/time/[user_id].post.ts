export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const userID = event.context.params?.user_id as string
    const { check_in_type, check_in_code } = body

    const now = new Date() 

    // Get all scheduled shifts for user
    const shifts = await prisma.scheduled_day.findMany({
        where: {
            userID: userID
        },
        include: {
            site: true
        }
    })

    // Find active shift (based on current time)
    const activeShift = shifts.find(shift => {

        const shiftStart = new Date(shift.date)

        const shiftEnd = new Date(shift.date)
        shiftEnd.setMinutes(shiftEnd.getMinutes() + shift.shift_duration)

        return now >= shiftStart && now <= shiftEnd
    })

    if (!activeShift) {

        console.error("No active shift found for user:", userID, "at", now.toISOString())

        throw createError({
            statusCode: 404,
            statusMessage: "No active shift at this time"
        })
    }

    // CHECK-IN
    if (check_in_type) {

        // Validate attendance code
        if (!check_in_code || check_in_code !== activeShift.site.attendance_code) {

            console.error("Invalid attendance code for user:", userID)

            throw createError({
                statusCode: 403,
                statusMessage: "Invalid attendance code"
            })
        }

        const attendance = await prisma.attendance.create({
            data: {
                userID: userID,
                clock_in_time: now, 
                status: "PRESENT"
            }
        })

        console.log("User checked in:", userID, now.toISOString())

        return attendance
    }

    // CHECK-OUT
    const attendanceRecord = await prisma.attendance.findFirst({
        where: {
            userID: userID
        },
        orderBy: {
            clock_in_time: "desc"
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

    console.log("User checked out:", userID, now.toISOString())

    return updatedAttendance
})