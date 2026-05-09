export default defineEventHandler(async (event) => {
  const site_id = event.context.params?.site_id as string
  const query = getQuery(event)
  const scheduled_day_id = query.scheduled_day_id as string

  if (!site_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Site ID is required"
    })
  }

  if (!scheduled_day_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "scheduled_day_id query parameter is required"
    })
  }

  const scheduledDay = await prisma.scheduled_day.findUnique({
    where: {
      id: scheduled_day_id
    }
  })

  if (!scheduledDay || scheduledDay.site_ID !== site_id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Scheduled day not found for this site"
    })
  }

  const interns = await prisma.intern.findMany({
    where: {
      attendance_history: {
        some: {
          shift_ID: scheduled_day_id
        }
      }
    },
    include: {
      attendance_history: {
        where: {
          shift_ID: scheduled_day_id
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
      },
      next_shift: {
        include: {
          location: true
        }
      },
      site_manager: {
        include: {
          locations: true
        }
      }
    }
  })

  return interns
})