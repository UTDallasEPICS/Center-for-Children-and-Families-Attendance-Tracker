export default defineEventHandler(async (event) => {

    const userID = event.context.params?.user_id as string

    // Check if currently clocked in 
    const attendance = await prisma.attendance.findFirst({
        where: {
            internID: userID,
            clock_in_time: { not: null },
            clock_out_time: null
        },
        orderBy: {
            clock_in_time: "desc"
        },
        include: {
            scheduled_day: true
        }
    })

    // if currently working
    if (attendance) {
        return {
            shift: attendance.scheduled_day,
            checkin_time: attendance.clock_in_time?.toISOString() ?? null,
            checkout_time: null
        }
    }

    // if not working return nextshift
    const intern = await prisma.intern.findUnique({
        where: { id: userID },
        include: {
            next_shift: true
        }
    })

    return {
        shift: intern?.next_shift ?? null,
        checkin_time: null,
        checkout_time: null
    }
})