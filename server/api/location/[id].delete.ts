export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing location id",
        })
    }

    const deletedLocation = await prisma.location.delete({
        where: {
            location_ID: id,
        },
    })

    return deletedLocation
})