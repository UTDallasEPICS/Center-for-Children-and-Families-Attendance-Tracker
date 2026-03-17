export default defineEventHandler(async (event) => {

    // Get userID from route param
    const userID = event.context.params?.user_id as string

    const now = new Date()

    // Start and end of today 
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    // Find today's attendance record
    const attendance = await prisma.attendance.findFirst({
        where: {
            userID: userID,
            clock_in_time: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        orderBy: {
            clock_in_time: "desc"
        }
    })

    // If no record exists, return null values
    if (!attendance) {
        return {
            checkin_time: null,
            checkout_time: null
        }
    }

    return {
        checkin_time: attendance.clock_in_time
            ? attendance.clock_in_time.toISOString()
            : null,

        checkout_time: attendance.clock_out_time
            ? attendance.clock_out_time.toISOString()
            : null
    }
})