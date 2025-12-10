import {prisma} from '../utils/prisma';

export default defineNitroPlugin( async (nitroApp) => {

  console.log('Nitro plugin', nitroApp)

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
                    
                    }
            },

            location:{
                create:{
                    location_name: 'place',
                    address: 'adress',
                    operation_days: 'MONDAY',
                    open_time: 1200,
                    close_time: 1500,
                    attendance_code: 1555,
                }
            },
            location_ID: 1,
        },
    })
    console.log('created user:', user)
})