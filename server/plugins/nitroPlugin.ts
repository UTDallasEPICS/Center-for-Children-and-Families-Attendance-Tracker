import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../app/generated/prisma';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? '',
});

const prisma = new PrismaClient({ adapter });

export { prisma };

export default defineNitroPlugin((nitroApp) => {

  console.log('Nitro plugin', nitroApp)

async function main() {
  
    const user = await prisma.user.create({
        data: {
        user_name:  'adrian',
        user_email: 'fake@email.com',
        user_phone: '123-456-7890',
        attendance_history: { 
            create: {
            clock_in_time: ("2025-01-15T12:00:00Z"),
            clock_out_time: ("2025-01-15T17:00:00Z"),
            status: 'PRESENT',
            }
        },

        schedule: {
             create:{
                date: new Date("2025-01-15T17:00:00Z"),
                shift_start: 1200,
                shift_end: 1500,
                status: "on_site",

                }
        },

        location:{
            create:{
                location_ID: 1,
                location_name: 'place',
                address: 'adress',
                operation_days: 'MONDAY',
                open_time: 1200,
                close_time: 1500,
                attendance_code: 1555,
                userId: 1
            }
        },
   
    },
    include: {},
    })
  console.log('created user:', user)

   const allUsers = await prisma.user.findMany({
    include: {},
  })
  console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
 
})