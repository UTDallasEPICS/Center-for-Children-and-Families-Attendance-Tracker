export default defineEventHandler(async (event) => {

    const userID = event.context.params?.user_id as string

    const intern = await prisma.intern.findUnique({
        where: { id: userID },
        include: {
            next_shift: true
        }
    })

    return {
        shift: intern?.next_shift ?? null,
        start_time: intern?.next_shift?.start_time ?? null,
        end_time: intern?.next_shift?.end_time ?? null
    }
})