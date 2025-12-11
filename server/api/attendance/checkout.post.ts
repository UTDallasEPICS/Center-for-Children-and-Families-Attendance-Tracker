import { readBody } from 'h3'
import type { CheckOutRequest, AttendanceResponse, AttendanceRecord } from '../../utils/types'
import { 
  readAttendanceRecords,
  updateAttendanceRecord,
  getTodayAttendance
} from '../../utils/db'

export default defineEventHandler(async (event): Promise<AttendanceResponse> => {
  try {
    const body = await readBody<CheckOutRequest>(event)
    
    // Find the active check-in record
    const todayRecords = await getTodayAttendance()
    let record: AttendanceRecord | undefined
    
    if (body.attendanceId) {
      record = todayRecords.find(r => r.id === body.attendanceId && r.status === 'checked')
    } else if (body.participantId) {
      record = todayRecords.find(r => r.participantId === body.participantId && r.status === 'checked')
    } else {
      // If no ID provided, get the most recent checked-in record
      record = todayRecords
        .filter(r => r.status === 'checked')
        .sort((a, b) => b.checkInTimestamp - a.checkInTimestamp)[0]
    }
    
    if (!record) {
      return {
        success: false,
        error: 'No active check-in found'
      }
    }
    
    // Calculate checkout time
    const now = new Date()
    const checkOutTimestamp = now.getTime()
    const checkOutTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })
    const totalTimeWorked = checkOutTimestamp - record.checkInTimestamp
    
    // Update the record
    const updatedRecord = await updateAttendanceRecord(record.id, {
      checkOutTimestamp,
      checkOutTime,
      totalTimeWorked,
      status: 'checked-out'
    })
    
    if (!updatedRecord) {
      return {
        success: false,
        error: 'Failed to update attendance record'
      }
    }
    
    return {
      success: true,
      data: updatedRecord,
      message: 'Successfully checked out'
    }
  } catch (error) {
    console.error('Check-out error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check out'
    }
  }
})

