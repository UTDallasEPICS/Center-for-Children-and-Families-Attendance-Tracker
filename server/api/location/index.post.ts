import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {

  const query = getQuery(event)  

  const location = await prisma.location.create({
      data: {
        location_name: query.location_name as string,
        address: query.address as string,
        operation_days: query.operation_days as any,
        open_time:  Number(query.close_time),
        close_time:  Number(query.close_time),
        attendance_code: 0,
      }
  })

  console.log("Created location:", location)
  return location
})