import { db } from '../../utils/db';

export default defineEventHandler((event) => {
    const workerId = event.context.params?.workerId;

    if (!workerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Worker ID is required',
        });
    }

    const stmt = db.prepare('SELECT * FROM attendance WHERE workerId = ? ORDER BY date DESC');
    const history = stmt.all(workerId);

    return history;
});
