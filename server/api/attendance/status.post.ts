export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { id, userID, clock_in_time, clock_out_time, status, request_status, reason } = body

    const updated = await prisma.attendance.update({
        where: { id },
        data: {
            clock_in_time: body.clock_in_time,
            clock_out_time: body.clock_out_time,
            status: body.status,
            request_status: body.request_status,
            reason: body.reason,
        },
    })

    return updated
})
