// Types for attendance tracking
export interface AttendanceRecord {
  id: string
  participantId?: string
  pin?: string
  checkInTimestamp: number
  checkOutTimestamp?: number
  checkInTime: string
  checkOutTime?: string
  date: string
  status: 'checked' | 'checked-out'
  totalTimeWorked?: number // in milliseconds
}

export interface CheckInRequest {
  pin: string
  participantId?: string
}

export interface CheckOutRequest {
  participantId?: string
  attendanceId?: string
}

export interface AttendanceResponse {
  success: boolean
  data?: AttendanceRecord
  message?: string
  error?: string
}

export interface AttendanceListResponse {
  success: boolean
  data?: AttendanceRecord[]
  message?: string
  error?: string
}

