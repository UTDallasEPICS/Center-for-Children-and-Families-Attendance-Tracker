export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing location id",
        })
    }

    return await prisma.location.findUnique({
        where: {
            location_ID: id,
        },
    })
})