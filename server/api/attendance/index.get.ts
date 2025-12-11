import type { AttendanceListResponse } from '../../utils/types'
import { 
  readAttendanceRecords,
  getTodayAttendance,
  getAttendanceByDate,
  getAttendanceByParticipant
} from '../../utils/db'

export default defineEventHandler(async (event): Promise<AttendanceListResponse> => {
  try {
    const query = getQuery(event)
    
    let records
    
    if (query.date) {
      // Get records for specific date
      records = await getAttendanceByDate(query.date as string)
    } else if (query.participantId) {
      // Get records for specific participant
      records = await getAttendanceByParticipant(query.participantId as string)
    } else if (query.today === 'true' || !query.date) {
      // Default to today's records
      records = await getTodayAttendance()
    } else {
      // Get all records
      records = await readAttendanceRecords()
    }
    
    // Sort by check-in timestamp (most recent first)
    records.sort((a, b) => b.checkInTimestamp - a.checkInTimestamp)
    
    return {
      success: true,
      data: records,
      message: `Found ${records.length} attendance record(s)`
    }
  } catch (error) {
    console.error('Get attendance error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get attendance records'
    }
  }
})

