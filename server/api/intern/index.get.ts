export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    if (query.ID) {
        const user = await prisma.intern.findUnique({
            where: {
                ID: query.ID as string,
            },
        })
        return user
    }

    if (query.user_name) {
        const user = await prisma.intern.findMany({
            where: {
                user_name: { startsWith: query.user_name as string },
            },
            include: {
                location: true,
            },
        })
        console.log("filtered intern: ", user)
        return intern
    }

    const user = await prisma.intern.findMany({
        include: {
            location: true,
        },
    })
    return user
})
