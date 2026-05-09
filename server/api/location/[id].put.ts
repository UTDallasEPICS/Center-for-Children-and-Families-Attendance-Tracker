export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }
    const body = await readBody(event)

    return await prisma.location.update({
        where: { location_ID: id },
        data: body,
    })
})