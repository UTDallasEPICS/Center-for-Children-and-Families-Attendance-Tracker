import { db } from '../../utils/db';
import { broadcast } from '../../utils/sse';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, status, checkIn } = body;

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID required' });
    }

    const stmt = db.prepare(`
    UPDATE workers 
    SET status = COALESCE(@status, status), 
        checkIn = COALESCE(@checkIn, checkIn)
    WHERE id = @id
  `);

    stmt.run({ id, status, checkIn });

    const updatedWorker = db.prepare('SELECT * FROM workers WHERE id = ?').get(id);

    // Broadcast the update
    broadcast('worker:update', updatedWorker);

    return updatedWorker;
});
