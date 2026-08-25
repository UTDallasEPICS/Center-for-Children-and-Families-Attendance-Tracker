export default defineEventHandler(async (event) => {
  const site_id = event.context.params?.site_id as string

  if (!site_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Site ID is required"
    })
  }

  const site = await prisma.location.findUnique({
    where: {
      id: site_id
    }
  })

  if (!site) {
    throw createError({
      statusCode: 404,
      statusMessage: "Site not found"
    })
  }

  const scheduledDays = await prisma.scheduled_day.findMany({
    where: {
      site_ID: site_id
    },
    orderBy: {
      start_time: "asc"
    },
    include: {
      location: true,
      attendance: {
        include: {
          intern: true,
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

  return scheduledDays
})