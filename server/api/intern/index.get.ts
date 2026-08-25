export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    //filter object
    const where: any = {}

    if (query.ID) {
        where.ID = query.ID as string
    }

    if (query.user_name) {
        where.user_name = {
            startsWith: query.user_name as string,
        }
    }

    // Fetch interns (all or filtered)
    const interns = await prisma.intern.findMany({
        where: Object.keys(where).length ? where : undefined,
        include: {
            location: true,
        },
    })

    console.log("interns:", interns)
    return interns
})