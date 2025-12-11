import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import type { AttendanceRecord } from './types'

const DB_DIR = join(process.cwd(), '.data')
const DB_FILE = join(DB_DIR, 'attendance.json')

// Ensure database directory exists
async function ensureDbDir() {
  if (!existsSync(DB_DIR)) {
    await mkdir(DB_DIR, { recursive: true })
  }
}

// Read all attendance records
export async function readAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    await ensureDbDir()
    
    if (!existsSync(DB_FILE)) {
      return []
    }
    
    const data = await readFile(DB_FILE, 'utf-8')
    return JSON.parse(data) as AttendanceRecord[]
  } catch (error) {
    console.error('Error reading attendance records:', error)
    return []
  }
}

// Write attendance records to file
export async function writeAttendanceRecords(records: AttendanceRecord[]): Promise<void> {
  try {
    await ensureDbDir()
    await writeFile(DB_FILE, JSON.stringify(records, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing attendance records:', error)
    throw error
  }
}

// Add a new attendance record
export async function addAttendanceRecord(record: AttendanceRecord): Promise<void> {
  const records = await readAttendanceRecords()
  records.push(record)
  await writeAttendanceRecords(records)
}

// Update an attendance record
export async function updateAttendanceRecord(
  id: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord | null> {
  const records = await readAttendanceRecords()
  const index = records.findIndex(r => r.id === id)
  
  if (index === -1) {
    return null
  }
  
  records[index] = { ...records[index], ...updates }
  await writeAttendanceRecords(records)
  return records[index]
}

// Get attendance records by date
export async function getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
  const records = await readAttendanceRecords()
  return records.filter(r => r.date === date)
}

// Get attendance records by participant
export async function getAttendanceByParticipant(participantId: string): Promise<AttendanceRecord[]> {
  const records = await readAttendanceRecords()
  return records.filter(r => r.participantId === participantId)
}

// Get today's attendance records
export async function getTodayAttendance(): Promise<AttendanceRecord[]> {
  const today = new Date().toDateString()
  return getAttendanceByDate(today)
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

