export default defineEventHandler(async (event) => {
  const site_id = event.context.params?.site_id as string

  if (!site_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Site ID is required"
    })
  }

  const interns = await prisma.intern.findMany({
    where: {
      User: {
        works_At: site_id
      }
    },
    include: {
      User: {
        include: {
          attendance_history: {
            orderBy: {
              clock_in_time: "desc"
            }
          },
          schedule: {
            orderBy: {
              date: "asc"
            }
          }
        }
      }
    }
  })

  return interns
})