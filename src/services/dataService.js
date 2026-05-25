import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  getAttendance,
  saveAttendance,
  getStoredStudents,
  saveStudents,
} from '../utils/storage'

function mapStudent(row) {
  return {
    id: row.id,
    name: row.name,
    matric: row.matric,
    course: row.course,
    email: row.email,
    status: row.status || 'Present',
  }
}

function mapAttendance(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    matric: row.matric,
    course: row.course,
    status: row.status,
    date: row.date,
  }
}

// ─── Local Storage ───────────────────────────────────────────

async function localFetchStudents() {
  const stored = getStoredStudents()
  return stored ?? []
}

async function localFetchAttendance() {
  return getAttendance()
}

async function localMarkAttendance(students, attendance, studentId, status, date) {
  const student = students.find((s) => s.id === studentId)
  if (!student) return { students, attendance }

  const record = {
    id: `${studentId}-${date}`,
    studentId,
    studentName: student.name,
    matric: student.matric,
    course: student.course,
    status,
    date,
  }

  const filtered = attendance.filter(
    (r) => !(r.studentId === studentId && r.date === date)
  )
  const updatedAttendance = [...filtered, record]
  saveAttendance(updatedAttendance)

  const updatedStudents = students.map((s) =>
    s.id === studentId ? { ...s, status } : s
  )
  saveStudents(updatedStudents)

  return { students: updatedStudents, attendance: updatedAttendance }
}

async function localAddStudent(students, formData) {
  const newId = Math.max(0, ...students.map((s) => s.id)) + 1
  const newStudent = {
    id: newId,
    name: formData.name,
    matric: formData.matric,
    course: formData.course,
    email: formData.email,
    status: 'Present',
  }
  const updated = [...students, newStudent]
  saveStudents(updated)
  return { students: updated, student: newStudent }
}

// ─── Supabase ────────────────────────────────────────────────

async function supabaseFetchStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('id')
  if (error) throw error
  return data.map(mapStudent)
}

async function supabaseFetchAttendance() {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data.map(mapAttendance)
}

async function supabaseMarkAttendance(students, _attendance, studentId, status, date) {
  const student = students.find((s) => s.id === studentId)
  if (!student) return null

  const { error: upsertError } = await supabase.from('attendance_records').upsert(
    {
      student_id: studentId,
      student_name: student.name,
      matric: student.matric,
      course: student.course,
      status,
      date,
    },
    { onConflict: 'student_id,date' }
  )
  if (upsertError) throw upsertError

  await supabase.from('students').update({ status }).eq('id', studentId)

  const [studentsData, attendanceData] = await Promise.all([
    supabaseFetchStudents(),
    supabaseFetchAttendance(),
  ])
  return { students: studentsData, attendance: attendanceData }
}

async function supabaseAddStudent(students, formData) {
  const { data, error } = await supabase
    .from('students')
    .insert({
      name: formData.name,
      matric: formData.matric,
      course: formData.course,
      email: formData.email,
      status: 'Present',
    })
    .select()
    .single()
  if (error) throw error
  const student = mapStudent(data)
  return { students: [...students, student], student }
}

// ─── Public API ──────────────────────────────────────────────

export function usingCloud() {
  return isSupabaseConfigured
}

export async function fetchStudents() {
  if (isSupabaseConfigured) return supabaseFetchStudents()
  return localFetchStudents()
}

export async function fetchAttendance() {
  if (isSupabaseConfigured) return supabaseFetchAttendance()
  return localFetchAttendance()
}

export async function markAttendanceRecord(students, attendance, studentId, status, date) {
  if (isSupabaseConfigured) {
    return supabaseMarkAttendance(students, attendance, studentId, status, date)
  }
  return localMarkAttendance(students, attendance, studentId, status, date)
}

export async function addStudentRecord(students, formData) {
  if (isSupabaseConfigured) return supabaseAddStudent(students, formData)
  return localAddStudent(students, formData)
}

export async function clearAttendanceRecords() {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('attendance_records').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) throw error
    return []
  }
  saveAttendance([])
  return []
}
