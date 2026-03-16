export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const userID = event.context.params?.user_id as string

    const { check_in_type, check_in_code } = body

    // Get current time
    const now = new Date()

    // Calculate start and end of today
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    // Find the user and their location
    const user = await prisma.user.findUnique({
        where: { ID: userID },
        include: { location: true }
    })

    if (!user) {

        console.error("User not found:", userID)

        throw createError({
            statusCode: 404,
            statusMessage: "User not found"
        })
    }

    // Verify attendance code during check-in
    if (check_in_type) {

        if (!check_in_code || check_in_code !== user.location.attendance_code) {

            console.error("Invalid attendance code for user:", userID)

            throw createError({
                statusCode: 403,
                statusMessage: "Invalid attendance code"
            })
        }
    }

    // Find today's attendance record
    const todayAttendance = await prisma.attendance.findFirst({
        where: {
            userID: userID,
            clock_in_time: {
                gte: startOfDay,
                lte: endOfDay
            }
        }
    })

    if (!todayAttendance) {

        console.error("No attendance record found for today for user:", userID)

        throw createError({
            statusCode: 404,
            statusMessage: "Attendance record for today not found"
        })
    }

    // Prevent checkout before check-in
    if (!check_in_type && !todayAttendance.clock_in_time) {

        console.error("Checkout attempted before check-in for user:", userID)

        throw createError({
            statusCode: 400,
            statusMessage: "Cannot check out before checking in"
        })
    }

    // Determine what field to update
    let updateData: any = {}

    if (check_in_type) {

        updateData.clock_in_time = now
        updateData.status = "PRESENT"

    } else {

        updateData.clock_out_time = now

    }

    // Update attendance record
    const attendance = await prisma.attendance.update({
        where: { id: todayAttendance.id },
        data: updateData
    })

    console.log("Attendance updated successfully for user:", userID)

    return attendance

})
