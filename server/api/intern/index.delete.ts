export default defineEventHandler(async (event) => {
    //delete user
    async function deleteUser(id: string) {
        const deleteUser = await prisma.user.delete({
            where: {
                ID: id,
            },
        })
    }

    async function deleteAllUsers() {
        const deleteUsers = await prisma.user.deleteMany()
    }

    const query = getQuery(event)

    if (query.ID) {
        return prisma.user.delete({
            where: { ID: query.ID as string },
        })
    }

    return deleteAllUsers()
})
