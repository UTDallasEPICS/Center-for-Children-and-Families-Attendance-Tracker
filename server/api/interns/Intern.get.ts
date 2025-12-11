export default defineEventHandler(async (event) => {
    const query = getQuery(event);
        
    //get all user
    async function getAll(){
        return  await prisma.user.findMany({
            include: {
                user_name:true,
                location: true,
            }
        });
    }
    //find many that is filters by name
    async function getAllFiltered(name: string){
        return await prisma.user.findMany({
            where: {  
                user_name: {startsWith: name,}
            },
            include: {
                user_name:true,
                location: true,
            }
        });
    }

    //get specific user based on ID
    async function findUser(id: string){
        const user = await prisma.user.findUnique({
            where: {
                ID: id,
            },
        })
    }

    if (query.ID) {
        return await findUser(query.ID as string)
    }

    if (query.name) {
        return await getAllFiltered(query.name as string)
    }

    console.log("this is our ")
    return await getAll()
})