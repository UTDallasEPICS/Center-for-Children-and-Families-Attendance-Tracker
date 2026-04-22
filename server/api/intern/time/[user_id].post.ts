export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const userID = event.context.params?.user_id as string
    const { check_in_type, check_in_code } = body

    const curr_date = new Date()

    // Find active shift 
    const potentialShift = await prisma.scheduled_day.findFirst({
        where: {
            userID: userID,
            date: {
                lte: curr_date
            }
        },
        orderBy: {
            date: "desc"
        },
        include: {
            site: true
        }
    })

    let activeShift = null

    if (potentialShift) {
        const shiftStart = new Date(potentialShift.date)

        const shiftEnd = new Date(potentialShift.date)
        shiftEnd.setMinutes(shiftEnd.getMinutes() + potentialShift.shift_duration)

        if (curr_date >= shiftStart && curr_date <= shiftEnd) {
            activeShift = potentialShift
        }
    }

    // If no valid shift found
    if (!activeShift) {
        throw createError({
            statusCode: 404,
            statusMessage: "No active shift found"
        })
    }

    // Validate attendance code
    if (check_in_type && activeShift.site.attendance_code !== check_in_code) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid attendance code"
        })
    }

    // Find today's attendance record
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    let attendance = await prisma.attendance.findFirst({
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

    // CHECK-IN
    if (check_in_type) {

        if (!attendance) {
            attendance = await prisma.attendance.create({
                data: {
                    userID: userID,
                    clock_in_time: curr_date,
                    status: "PRESENT"
                }
            })
        } else {
            attendance = await prisma.attendance.update({
                where: {
                    id: attendance.id
                },
                data: {
                    clock_in_time: curr_date
                }
            })
        }
    }

    // CHECK-OUT
    else {

        if (!attendance || !attendance.clock_in_time) {
            throw createError({
                statusCode: 400,
                statusMessage: "Cannot check out before checking in"
            })
        }

        attendance = await prisma.attendance.update({
            where: {
                id: attendance.id
            },
            data: {
                clock_out_time: curr_date
            }
        })
    }

    return attendance
})