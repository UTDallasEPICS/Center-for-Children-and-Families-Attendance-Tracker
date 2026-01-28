export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    if (query.ID) {
        const user = await prisma.user.findUnique({
            where: {
                ID: query.ID as string,
            },
        })
        return user
    }

    if (query.user_name) {
        const user = await prisma.user.findMany({
            where: {
                user_name: { startsWith: query.user_name as string },
            },
            include: {
                location: true,
            },
        })
        console.log("filtered users: ", user)
        return user
    }

    const user = await prisma.user.findMany({
        include: {
            location: true,
        },
    })
    return user
})
