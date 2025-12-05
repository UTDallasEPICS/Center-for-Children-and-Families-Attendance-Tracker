import { db } from '../../utils/db';

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const search = query.search as string;
    const status = query.status as string;
    const date = query.date as string;

    // If date is provided and it's not today, we need to fetch historical status
    // We'll use a LEFT JOIN to get attendance status for that specific date
    // If no attendance record exists for that date, they are considered 'absent' (or we could handle it differently)

    let sql = '';
    const params: any[] = [];

    if (date) {
        // Historical query
        sql = `
            SELECT 
                w.*,
                COALESCE(a.status, 'absent') as status,
                a.checkIn,
                a.checkOut,
                a.hours,
                a.id as attendanceId
            FROM workers w
            LEFT JOIN attendance a ON w.id = a.workerId AND a.date = ?
            WHERE 1=1
        `;
        params.push(date);
    } else {
        // Current status query (default)
        sql = 'SELECT * FROM workers WHERE 1=1';
    }

    if (search) {
        sql += ' AND w.name LIKE ?';
        params.push(`%${search}%`);
    }

    if (status && status !== 'all') {
        if (date) {
            sql += ' AND (a.status = ? OR (a.status IS NULL AND ? = "absent"))';
            params.push(status, status);
        } else {
            sql += ' AND status = ?';
            params.push(status);
        }
    }

    const stmt = db.prepare(sql);
    const workers = stmt.all(...params);

    return workers;
});
