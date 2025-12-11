export default defineEventHandler(async (event) => {
  const query = getQuery(event); 

  const user = prisma.user.create({
    data: {
      user_name: query.user_name as string,
      user_email: query.user_email as string,
      user_phone: query.user_phone as string,
      
      location: {connect: {location_ID:query.location_ID as string}}
    },
  })

  console.log("user created")
  return user
})