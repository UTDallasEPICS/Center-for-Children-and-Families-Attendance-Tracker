import { prisma } from "../../utils/prisma"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const location = await prisma.location.create({
        data: {
            location_name: body.location_name,
            address: body.address,
            operation_days: body.operation_days,
            open_time: Number(body.open_time),
            close_time: Number(body.close_time),
            attendance_code: 0,
        },
    })

    console.log("Created location:", location)
    return location
})