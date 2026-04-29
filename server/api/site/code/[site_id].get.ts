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
    }
  })

  if (!site) {
    throw createError({
      statusCode: 404,
      statusMessage: "Site not found"
    })
  }

  const now = new Date()

  const expired =
    !site.code_generated_at ||
    (now.getTime() - new Date(site.code_generated_at).getTime()) >
      (site.code_expiry_min || 60) * 60000

  let code = site.attendance_code

  if (!code || expired) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    code = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")

    await prisma.location.update({
      where: {
        location_ID: site_id
      },
      data: {
        attendance_code: code,
        code_generated_at: now
      }
    })
  }

  setHeader(event, "Content-Type", "text/plain")

  return code
})