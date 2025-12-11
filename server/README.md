# Nitro Backend API Documentation

This directory contains the Nitro backend API for the attendance tracking system.

## API Endpoints

### POST `/api/attendance/checkin`
Check in with a PIN.

**Request Body:**
```json
{
  "pin": "1234",
  "participantId": "optional-participant-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "timestamp-random",
    "pin": "1234",
    "checkInTimestamp": 1234567890,
    "checkInTime": "9:00:00 AM",
    "date": "Mon Jan 01 2024",
    "status": "checked"
  },
  "message": "Successfully checked in"
}
```

### POST `/api/attendance/checkout`
Check out from an active check-in.

**Request Body:**
```json
{
  "participantId": "optional-participant-id",
  "attendanceId": "optional-attendance-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "timestamp-random",
    "checkInTimestamp": 1234567890,
    "checkOutTimestamp": 1234600000,
    "checkInTime": "9:00:00 AM",
    "checkOutTime": "10:00:00 AM",
    "totalTimeWorked": 31100000,
    "status": "checked-out"
  },
  "message": "Successfully checked out"
}
```

### GET `/api/attendance`
Get attendance records.

**Query Parameters:**
- `date` (optional): Get records for a specific date (e.g., "Mon Jan 01 2024")
- `participantId` (optional): Get records for a specific participant
- `today` (optional): Set to "true" to get today's records (default)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "timestamp-random",
      "pin": "1234",
      "checkInTimestamp": 1234567890,
      "checkInTime": "9:00:00 AM",
      "date": "Mon Jan 01 2024",
      "status": "checked"
    }
  ],
  "message": "Found 1 attendance record(s)"
}
```

### GET `/api/attendance/[id]`
Get a specific attendance record by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "timestamp-random",
    "pin": "1234",
    "checkInTimestamp": 1234567890,
    "checkInTime": "9:00:00 AM",
    "date": "Mon Jan 01 2024",
    "status": "checked"
  }
}
```

### GET `/api/attendance/status`
Get current attendance status for a PIN or participant.

**Query Parameters:**
- `pin` (optional): 4-digit PIN
- `participantId` (optional): Participant ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "timestamp-random",
    "pin": "1234",
    "checkInTimestamp": 1234567890,
    "checkInTime": "9:00:00 AM",
    "date": "Mon Jan 01 2024",
    "status": "checked"
  },
  "message": "Current status: checked"
}
```

## Using the Composable

In your Vue components, use the `useAttendance` composable:

```vue
<script setup lang="ts">
const { checkIn, checkOut, getAttendance, getStatus } = useAttendance()

// Check in
const handleCheckIn = async (pin: string) => {
  const response = await checkIn(pin)
  if (response.success) {
    console.log('Checked in:', response.data)
  } else {
    console.error('Error:', response.error)
  }
}

// Check out
const handleCheckOut = async () => {
  const response = await checkOut()
  if (response.success) {
    console.log('Checked out:', response.data)
  }
}

// Get today's attendance
const loadAttendance = async () => {
  const response = await getAttendance({ today: true })
  if (response.success) {
    console.log('Attendance records:', response.data)
  }
}
</script>
```

## Data Storage

Currently, attendance records are stored in a JSON file at `.data/attendance.json`. This is suitable for development and small deployments. For production, consider:

1. **Database Integration**: Update `server/utils/db.ts` to use a database (PostgreSQL, MongoDB, etc.)
2. **Environment Variables**: Store database connection strings in `.env` files
3. **Authentication**: Add authentication middleware for secure API access

## File Structure

```
server/
├── api/
│   └── attendance/
│       ├── checkin.post.ts      # Check-in endpoint
│       ├── checkout.post.ts      # Check-out endpoint
│       ├── index.get.ts          # List attendance records
│       ├── [id].get.ts           # Get specific record
│       └── status.get.ts         # Get current status
└── utils/
    ├── types.ts                  # TypeScript types
    └── db.ts                    # Database utilities
```

