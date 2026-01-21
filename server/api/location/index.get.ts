export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
//get all user
 
    async function getAll(){
    const location = await prisma.location.findMany();
    }

    //find many that is filters by name
    async function getAllFiltered(name: string){
        const location = await prisma.location.findMany({
            where: {  
                location_name: {startsWith: name,}
        }
    });
    }
    //figure out filter logic
    if(body){
        
    }
    return await getAll()
})

/*

export async function getAllFiltered(name: string){
    const location = await prisma.location.findMany({
        where: {  
            location_name: {startsWith: name,}
        }
    });
}

//get specific user based on ID
export async function findLocation(id: string){
    const location = await prisma.location.findUnique({
        where: {
            location_ID: id,
        },
    })
}
*/