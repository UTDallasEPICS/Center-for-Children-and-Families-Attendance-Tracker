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
      location_ID: site_id
    },
    select: {
      attendance_code: true
    }
  })

  if (!site || !site.attendance_code) {
    throw createError({
      statusCode: 404,
      statusMessage: "Attendance code not found for this site"
    })
  }

  setHeader(event, "Content-Type", "text/plain")

  return site.attendance_code
})