export default defineEventHandler(async (event) => {
    //delete
    const query = getQuery(event)

    async function deleteLocation(id: string) {
        const deleteLocation = await prisma.location.delete({
            where: {
                location_ID: id,
            },
        })
    }

    return prisma.location.delete({
        where: { location_ID: query.ID as string },
    })
})
