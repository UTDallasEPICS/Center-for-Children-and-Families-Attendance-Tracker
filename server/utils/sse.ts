import { H3Event } from 'h3';

type SSEClient = {
    id: string;
    send: (data: string) => void;
};

const clients = new Map<string, SSEClient>();

export function addClient(id: string, send: (data: string) => void) {
    clients.set(id, { id, send });
}

export function removeClient(id: string) {
    clients.delete(id);
}

export function broadcast(event: string, data: any) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of clients.values()) {
        client.send(message);
    }
}
