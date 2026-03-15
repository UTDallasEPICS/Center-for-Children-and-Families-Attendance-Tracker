export default defineEventHandler(async (event) => {
    // Basic endpoint handling and request parameter extraction
    const body = await readBody(event)

    const userID = event.context.params?.userID as string
    const { check_in_type, check_in_code } = body

    // Stores current date for todays check in/check out   
    const now = new Date()

    // Find the latest attendance record for user by sorting clock in times in descending order
    let todayAttendance = await prisma.attendance.findFirst({
        where: {
            userID: userID
        },
        orderBy: {
            clock_in_time: 'desc'
        }
    })

    // If no attendance record exists create one (new user)
    if (!todayAttendance) {

        // If user has no record and teempts to check out (meaning they never checked in) error
        if (!check_in_type) {
            console.error("Checkout attempted before first check-in for user:", userID)
            
            throw createError({
                statusCode: 400,
                statusMessage: "Cannot check out before checking in"
            })
        }

        // Create a new attendance record for new user 
        const newAttendance = await prisma.attendance.create({
            data: {
                userID: userID,
                clock_in_time: now,
                status: "PRESENT"
            }
        })

        // Log creation of new user
        console.log("New attendance record created for user:", userID)

        return newAttendance
    }

    // Prevent checkout before checkin
    if (!check_in_type && !todayAttendance.clock_in_time) {

        console.error("Checkout attempted before checkin for user:", userID)

        throw createError({
            statusCode: 400,
            statusMessage: "Cannot check out before checking in"
        })
    }

    // Update database
    let updateData: any = {}
  
    if (check_in_type) {
        updateData.clock_in_time = now
    } else {
        updateData.clock_out_time = now
    }

    // Updates existing records with new timings, makes sure to keep previous records
    const attendance = await prisma.attendance.update({
        where: {
            id: todayAttendance.id
        },
        data: updateData
    })

    console.log("Attendance updated for user:", userID)

    return attendance
})
