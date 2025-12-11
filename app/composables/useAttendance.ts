import type { 
  AttendanceRecord, 
  AttendanceResponse, 
  AttendanceListResponse,
  CheckInRequest,
  CheckOutRequest
} from '../../server/utils/types'

export const useAttendance = () => {
  /**
   * Check in with PIN
   */
  const checkIn = async (pin: string, participantId?: string): Promise<AttendanceResponse> => {
    try {
      const response = await $fetch<AttendanceResponse>('/api/attendance/checkin', {
        method: 'POST',
        body: {
          pin,
          participantId
        } as CheckInRequest
      })
      return response
    } catch (error) {
      console.error('Check-in error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check in'
      }
    }
  }

  /**
   * Check out
   */
  const checkOut = async (participantId?: string, attendanceId?: string): Promise<AttendanceResponse> => {
    try {
      const response = await $fetch<AttendanceResponse>('/api/attendance/checkout', {
        method: 'POST',
        body: {
          participantId,
          attendanceId
        } as CheckOutRequest
      })
      return response
    } catch (error) {
      console.error('Check-out error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check out'
      }
    }
  }

  /**
   * Get attendance records
   */
  const getAttendance = async (options?: {
    date?: string
    participantId?: string
    today?: boolean
  }): Promise<AttendanceListResponse> => {
    try {
      const query = new URLSearchParams()
      if (options?.date) query.append('date', options.date)
      if (options?.participantId) query.append('participantId', options.participantId)
      if (options?.today) query.append('today', 'true')

      const queryString = query.toString()
      const url = `/api/attendance${queryString ? `?${queryString}` : ''}`
      
      const response = await $fetch<AttendanceListResponse>(url)
      return response
    } catch (error) {
      console.error('Get attendance error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get attendance records'
      }
    }
  }

  /**
   * Get attendance record by ID
   */
  const getAttendanceById = async (id: string): Promise<AttendanceResponse> => {
    try {
      const response = await $fetch<AttendanceResponse>(`/api/attendance/${id}`)
      return response
    } catch (error) {
      console.error('Get attendance by ID error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get attendance record'
      }
    }
  }

  /**
   * Get current attendance status
   */
  const getStatus = async (pin?: string, participantId?: string): Promise<AttendanceResponse> => {
    try {
      const query = new URLSearchParams()
      if (pin) query.append('pin', pin)
      if (participantId) query.append('participantId', participantId)

      const queryString = query.toString()
      const url = `/api/attendance/status${queryString ? `?${queryString}` : ''}`
      
      const response = await $fetch<AttendanceResponse>(url)
      return response
    } catch (error) {
      console.error('Get status error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get status'
      }
    }
  }

  return {
    checkIn,
    checkOut,
    getAttendance,
    getAttendanceById,
    getStatus
  }
}

