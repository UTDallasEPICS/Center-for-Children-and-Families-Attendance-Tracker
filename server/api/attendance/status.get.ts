import type { AttendanceResponse, AttendanceRecord } from '../../utils/types'
import { getTodayAttendance } from '../../utils/db'

export default defineEventHandler(async (event): Promise<AttendanceResponse> => {
  try {
    const query = getQuery(event)
    const pin = query.pin as string
    const participantId = query.participantId as string
    
    if (!pin && !participantId) {
      return {
        success: false,
        error: 'PIN or participant ID is required'
      }
    }
    
    const todayRecords = await getTodayAttendance()
    
    let record
    if (pin) {
      record = todayRecords.find(r => r.pin === pin)
    } else if (participantId) {
      record = todayRecords.find(r => r.participantId === participantId)
    }
    
    if (!record) {
      return {
        success: true,
        message: 'No attendance record found for today'
      }
    }
    
    return {
      success: true,
      data: record,
      message: `Current status: ${record.status}`
    }
  } catch (error) {
    console.error('Get status error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get status'
    }
  }
})

