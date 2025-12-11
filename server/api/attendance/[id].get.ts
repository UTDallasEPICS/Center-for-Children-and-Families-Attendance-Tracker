import type { AttendanceResponse, AttendanceRecord } from '../../utils/types'
import { readAttendanceRecords } from '../../utils/db'

export default defineEventHandler(async (event): Promise<AttendanceResponse> => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      return {
        success: false,
        error: 'Attendance ID is required'
      }
    }
    
    const records = await readAttendanceRecords()
    const record = records.find((r: AttendanceRecord) => r.id === id)
    
    if (!record) {
      return {
        success: false,
        error: 'Attendance record not found'
      }
    }
    
    return {
      success: true,
      data: record
    }
  } catch (error) {
    console.error('Get attendance by ID error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get attendance record'
    }
  }
})

