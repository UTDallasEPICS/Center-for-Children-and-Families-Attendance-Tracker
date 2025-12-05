# Site Manager Architecture

## Overview
The Site Manager page is powered by a local SQLite database and uses Server-Sent Events (SSE) for real-time updates. This ensures that the dashboard always reflects the latest worker status without needing to refresh the page.

## Database
- **Technology**: SQLite (via `better-sqlite3`)
- **File**: `data.db` (created in the project root)
- **Schema**:
    - `workers`: Stores worker details (name, status, role, etc.)
    - `attendance`: Stores historical check-in/out records.
- **Seeding**: The database is automatically seeded with mock data on the first run if it's empty.

## Live Updates (SSE)
- **Endpoint**: `/api/sse`
- **Mechanism**: The frontend connects to this endpoint using `EventSource`.
- **Events**:
    - `worker:update`: Broadcasted whenever a worker's information changes. The payload contains the updated worker object.

## API Endpoints
- `GET /api/workers`: Fetch all workers (supports `search` and `status` query params).
- `GET /api/workers/:id`: Fetch a single worker.
- `GET /api/attendance/:workerId`: Fetch attendance history.
- `POST /api/debug/update-worker`: (Debug) Update a worker's status and trigger an SSE broadcast.

## How to Test Live Updates
1. Open the Site Manager page in your browser.
2. Open a terminal or HTTP client (like Postman).
3. Send a POST request to update a worker:
   ```bash
   curl -X POST http://localhost:3000/api/debug/update-worker \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "status": "late"}'
   ```
4. Observe the worker's status change instantly on the dashboard.

## Future Integration (Production DB)
When your team's database is ready, we can switch from this local SQLite instance to the real database:
1. **Schema Handoff**: Provide the database schema (ER Diagram or SQL `CREATE TABLE` scripts).
2. **Connection Update**: We will update `server/utils/db.ts` to connect to the new database (whether it's Postgres, MySQL, or another SQLite instance).
3. **Query Refactoring**: We will update the SQL queries in `server/api/` to match the real table and column names.

