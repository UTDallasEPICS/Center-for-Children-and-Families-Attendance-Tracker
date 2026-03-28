export default defineEventHandler(async (event) => {
  const site_id = event.context.params?.site_id as string

  // Error if no site id is given
  if (!site_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Site ID is required"
    })
  }

  // Date validation
  const now = new Date()

  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)

  // Make sure attendance code is generated at site and during the same day
  const site = await prisma.location.findUnique({
    where: {
      location_ID: site_id
    },
    select: {
      attendance_code: true,
      code_generated_at: true 
    }
  })

  // No code generated for this site
  if (!site || !site.attendance_code) {
    throw createError({
      statusCode: 404,
      statusMessage: "Attendance code not found for this site"
    })
  }

  // No code generated for this day
  if (site.code_generated_at) {
    const generated = new Date(site.code_generated_at)

    if (generated < startOfDay || generated > endOfDay) {
      throw createError({
        statusCode: 404,
        statusMessage: "Attendance code has not been generated for today"
      })
    }
  }

  
  setHeader(event, "Content-Type", "text/plain")

  return site.attendance_code
})