export default defineEventHandler(async (event) => {
    //delete user
    async function deleteUser(id: string) {
        const deleteUser = await prisma.intern.delete({
            where: {
                ID: id,
            },
        })
    }

    async function deleteAllUsers() {
        const deleteUsers = await prisma.intern.deleteMany()
    }

    const query = getQuery(event)

    if (query.ID) {
        return prisma.intern.delete({
            where: { ID: query.ID as string },
        })
    }

    return deleteAllUsers()
})
