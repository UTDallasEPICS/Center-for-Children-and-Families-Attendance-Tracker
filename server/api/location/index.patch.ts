export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const query = getQuery(event)
    async function updateLocationInfo(id: string, data: Record<string, any>){
        return prisma.location.update({
            where:{location_ID: id},
            data: data,
        })
    }

    if(query.attendance_code){
        const location = await prisma.location.update({
            where: {location_ID: query.location_ID as string},
            data:{
                attendance_code: Number(query.attendance_code),
            }
        })
        return location
    }
})