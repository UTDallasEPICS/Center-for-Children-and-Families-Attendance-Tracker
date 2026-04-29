export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const body = await readBody(event) // body should be JSON with fields to update

    // Update user
    const user = await prisma.intern.update({
        where: { ID: query.ID as string },
        data: body,
    })

    console.log("intern information has been updated!", user)
    return user
})
