export default defineEventHandler(async (event) => {
    
   const { id } = event.context.params

    if (id) {
        const user = await prisma.user.findUnique({
            where: {
                ID: id,
            },
        })

        return user
    }

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
        })
    }

})
