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

  const now = new Date()
  const expired = !site.code_expires_at || now >= site.code_expires_at

  let code = site.attendance_code

  if (!code || expired) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    code = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")

    const code_expires_at = new Date(now.getTime() + 15 * 60000)

    await prisma.location.update({
      where: {
        id: site_id
      },
      data: {
        attendance_code: code,
        code_expires_at
      }
    })
  }

  setHeader(event, "Content-Type", "text/plain")

  return code
})