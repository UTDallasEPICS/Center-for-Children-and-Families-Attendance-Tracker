import { readBody } from 'h3'
import type { CheckInRequest, AttendanceResponse, AttendanceRecord } from '../../utils/types'
import { 
  addAttendanceRecord, 
  getTodayAttendance, 
  generateId 
} from '../../utils/db'

export default defineEventHandler(async (event): Promise<AttendanceResponse> => {
  try {
    const body = await readBody<CheckInRequest>(event)
    
    if (!body.pin || body.pin.length !== 4) {
      return {
        success: false,
        error: 'Invalid PIN. PIN must be 4 digits.'
      }
    }
    
    // Check if user already checked in today
    const todayRecords = await getTodayAttendance()
    const existingRecord = todayRecords.find(
      (record: AttendanceRecord) => record.pin === body.pin && record.status === 'checked'
    )
    
    if (existingRecord) {
      return {
        success: false,
        error: 'You have already checked in today.'
      }
    }
    
    // Create new attendance record
    const now = new Date()
    const checkInTimestamp = now.getTime()
    const checkInTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })
    
    const record: AttendanceRecord = {
      id: generateId(),
      participantId: body.participantId,
      pin: body.pin,
      checkInTimestamp,
      checkInTime,
      date: now.toDateString(),
      status: 'checked'
    }
    
    await addAttendanceRecord(record)
    
    return {
      success: true,
      data: record,
      message: 'Successfully checked in'
    }
  } catch (error) {
    console.error('Check-in error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check in'
    }
  }
})

