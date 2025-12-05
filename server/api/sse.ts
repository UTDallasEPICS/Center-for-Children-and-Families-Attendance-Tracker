import { addClient, removeClient } from '../utils/sse';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler((event) => {
    setHeader(event, 'Content-Type', 'text/event-stream');
    setHeader(event, 'Cache-Control', 'no-cache');
    setHeader(event, 'Connection', 'keep-alive');
    setResponseStatus(event, 200);

    const id = uuidv4();

    const stream = new ReadableStream({
        start(controller) {
            const send = (data: string) => {
                controller.enqueue(new TextEncoder().encode(data));
            };

            addClient(id, send);

            // Send initial ping
            send(': connected\n\n');
        },
        cancel() {
            removeClient(id);
        },
    });

    return sendStream(event, stream);
});
