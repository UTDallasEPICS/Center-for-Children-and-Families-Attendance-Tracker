export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const userID = event.context.params?.user_id as string
    const { check_in_type, check_in_code } = body

    const now = new Date()

    // Find active shift 
    const shifts = await prisma.scheduled_day.findMany({
        where: {
            userID: userID
        },
        include: {
            site: true
        }
    })

    let activeShift = null

    for (const shift of shifts) {
        const shiftStart = new Date(shift.date)

        const shiftEnd = new Date(shift.date)
        shiftEnd.setMinutes(shiftEnd.getMinutes() + shift.shift_duration)

        if (now >= shiftStart && now <= shiftEnd) {
            activeShift = shift
            break
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

    // Find attendance record for THIS SHIFT (FIXED)
    const shiftStart = new Date(activeShift.date)

    const shiftEnd = new Date(activeShift.date)
    shiftEnd.setMinutes(shiftEnd.getMinutes() + activeShift.shift_duration)

    let attendance = await prisma.attendance.findFirst({
        where: {
            userID: userID,
            clock_in_time: {
                gte: shiftStart,
                lte: shiftEnd
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
                    clock_in_time: now,
                    status: "PRESENT"
                }
            })
        } else {
            attendance = await prisma.attendance.update({
                where: {
                    id: attendance.id
                },
                data: {
                    clock_in_time: now
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
                clock_out_time: now
            }
        })
    }

    return attendance
})