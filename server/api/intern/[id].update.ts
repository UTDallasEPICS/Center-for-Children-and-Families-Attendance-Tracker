export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }
    const body = await readBody(event) // JSON fields

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing user ID in route parameter",
        })
    }

    const user = await prisma.user.update({
        where: { ID: id },
        data: body,
    })

    console.log("User information has been updated!", user)
    return user
})