export default defineEventHandler(async (event) => {
    
   const { id } = event.context.params

    if (!id) {
        throw createError({
        statusCode: 400,
        statusMessage: "Missing required query parameter: id",
        })
    }

  const user = await prisma.user.findUnique({
        where: {
        ID: id as string,
        },
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
        })
    }

})
