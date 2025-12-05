// fetch is global in Node 22

async function test() {
    try {
        console.log('Testing GET /api/workers...');
        const workersRes = await fetch('http://localhost:3000/api/workers');
        if (!workersRes.ok) throw new Error(`Failed to fetch workers: ${workersRes.statusText}`);
        const workers = await workersRes.json();
        console.log(`Fetched ${workers.length} workers.`);

        console.log('Testing POST /api/debug/update-worker...');
        const updateRes = await fetch('http://localhost:3000/api/debug/update-worker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 1, status: 'late' })
        });

        if (!updateRes.ok) {
            // If 404, it means the endpoint doesn't exist (server didn't reload)
            if (updateRes.status === 404) {
                console.error('Endpoint not found. Server might need a restart.');
            } else {
                throw new Error(`Failed to update worker: ${updateRes.statusText}`);
            }
        } else {
            const updatedWorker = await updateRes.json();
            console.log('Updated worker:', updatedWorker);
        }

    } catch (err) {
        console.error('Test failed:', err);
    }
}

test();
