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
      OR: [
        {
          next_shift: {
            site_ID: site_id
          }
        },
        {
          attendance_history: {
            some: {
              scheduled_day: {
                site_ID: site_id
              }
            }
          }
        }
      ]
    },
    include: {
      next_shift: {
        include: {
          location: true
        }
      },
      site_manager: {
        include: {
          locations: true
        }
      },
      attendance_history: {
        where: {
          scheduled_day: {
            site_ID: site_id
          }
        },
        orderBy: {
          clock_in_time: "desc"
        },
        include: {
          scheduled_day: {
            include: {
              location: true
            }
          },
          shift_request: {
            include: {
              created_by: true,
              picked_up_by: true
            }
          }
        }
      }
    }
  })

  return interns
})