export default defineEventHandler(async (event) => {
    const site_id = event.context.params?.site_id as string

    if (!site_id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Site ID is required"
        })
    }

    // Find interns assigned to this site
    const interns = await prisma.user.findMany({
        where: {
            works_At: site_id,
        },
        select: {
            ID: true,
            user_name: true,
            user_email: true,
            user_phone: true,

            attendance_history: {
                orderBy: {
                    clock_in_time: "desc"
                },
                take: 1, // Latest attendance only
                select: {
                    clock_in_time: true,
                    clock_out_time: true,
                    status: true
                }
            },

            schedule: {
                where: {
                    date: {
                        gte: new Date() // Upcoming shifts 
                    }
                },
                orderBy: {
                    date: "asc"
                },
                take: 1, // Next shift
                select: {
                    date: true,
                    shift_duration: true,
                    status: true
                }
            }
        }
    })

    return interns
})