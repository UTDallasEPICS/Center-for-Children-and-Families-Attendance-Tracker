export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const user = await prisma.intern.create({
        data: {
            user_name: body.user_name,
            user_email: body.user_email,
            user_phone: body.user_phone,

            location: {
                connect: {
                    location_ID: body.location_ID,
                },
            },
        },
    })

    console.log("intern created")
    return user
})