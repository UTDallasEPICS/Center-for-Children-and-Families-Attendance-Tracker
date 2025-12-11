export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    async function updateLocationInfo(id: string, data: Record<string, any>){
        return prisma.location.update({
            where:{location_ID: id},
            data: data,
        })
    }
})