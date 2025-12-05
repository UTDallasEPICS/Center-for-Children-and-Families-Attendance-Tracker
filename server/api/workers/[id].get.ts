import { db } from '../../utils/db';

export default defineEventHandler((event) => {
    const id = event.context.params?.id;

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Worker ID is required',
        });
    }

    const stmt = db.prepare('SELECT * FROM workers WHERE id = ?');
    const worker = stmt.get(id);

    if (!worker) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Worker not found',
        });
    }

    return worker;
});
