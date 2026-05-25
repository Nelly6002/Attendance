import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  getSessions,
  saveSessions,
  getSignIns,
  saveSignIns,
  getAttendance,
  saveAttendance,
  clearSessions,
} from '../utils/storage'
import { generateSessionCode, isSessionActive } from '../utils/sessions'
import { getTodayDate } from '../utils/attendance'

function mapSession(row) {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    course: row.course,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    startedAt: row.started_at,
    endsAt: row.ends_at,
    durationMinutes: row.duration_minutes,
    status: row.status,
    createdAt: row.created_at,
  }
}

function mapSignIn(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    studentId: row.student_id,
    studentName: row.student_name,
    matric: row.matric,
    signedAt: row.signed_at,
    status: row.status || 'Present',
  }
}

// ─── Local ───────────────────────────────────────────────────

function localFetchSessions() {
  const sessions = getSessions()
  return sessions.map((s) => ({
    ...s,
    status: isSessionActive(s) ? 'active' : s.status === 'ended' ? 'ended' : 'expired',
  }))
}

function localFetchSignIns() {
  return getSignIns()
}

function localStartSession(teacher, { title, course, durationMinutes }) {
  const sessions = getSessions()
  const now = new Date()
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000)
  const session = {
    id: crypto.randomUUID(),
    code: generateSessionCode(),
    title,
    course,
    teacherId: teacher.id,
    teacherName: teacher.name,
    startedAt: now.toISOString(),
    endsAt: endsAt.toISOString(),
    durationMinutes,
    status: 'active',
    createdAt: now.toISOString(),
  }
  saveSessions([session, ...sessions])
  return session
}

function localEndSession(sessionId) {
  const sessions = getSessions().map((s) =>
    s.id === sessionId ? { ...s, status: 'ended' } : s
  )
  saveSessions(sessions)
  return sessions.find((s) => s.id === sessionId)
}

function localSignIn(session, student) {
  const signIns = getSignIns()
  const existing = signIns.find(
    (s) => s.sessionId === session.id && s.studentId === student.id
  )
  if (existing) return { error: 'You already signed in for this session.' }

  if (!isSessionActive(session)) {
    return { error: 'This session has ended. You can no longer sign in.' }
  }

  const record = {
    id: crypto.randomUUID(),
    sessionId: session.id,
    studentId: student.id,
    studentName: student.name,
    matric: student.matric,
    signedAt: new Date().toISOString(),
    status: 'Present',
  }
  saveSignIns([record, ...signIns])

  const today = getTodayDate()
  const attendance = getAttendance()
  const entry = {
    id: `${student.id}-${today}`,
    studentId: student.id,
    studentName: student.name,
    matric: student.matric,
    course: student.course,
    status: 'Present',
    date: today,
    sessionId: session.id,
  }
  const filtered = attendance.filter(
    (r) => !(r.studentId === student.id && r.date === today)
  )
  saveAttendance([...filtered, entry])
  window.dispatchEvent(new Event('attendance-updated'))

  return { signIn: record }
}

function localFindSessionByCode(code) {
  const sessions = getSessions()
  const session = sessions.find(
    (s) => s.code.toUpperCase() === code.toUpperCase() && isSessionActive(s)
  )
  return session || null
}

// ─── Supabase ────────────────────────────────────────────────

async function supabaseFetchSessions() {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapSession)
}

async function supabaseFetchSignIns() {
  const { data, error } = await supabase
    .from('session_sign_ins')
    .select('*')
    .order('signed_at', { ascending: false })
  if (error) throw error
  return data.map(mapSignIn)
}

async function supabaseStartSession(teacher, { title, course, durationMinutes }) {
  const now = new Date()
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000)
  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert({
      code: generateSessionCode(),
      title,
      course,
      teacher_id: teacher.id,
      teacher_name: teacher.name,
      started_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      duration_minutes: durationMinutes,
      status: 'active',
    })
    .select()
    .single()
  if (error) throw error
  return mapSession(data)
}

async function supabaseEndSession(sessionId) {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .update({ status: 'ended' })
    .eq('id', sessionId)
    .select()
    .single()
  if (error) throw error
  return mapSession(data)
}

async function supabaseSignIn(session, student) {
  const { data: existing } = await supabase
    .from('session_sign_ins')
    .select('id')
    .eq('session_id', session.id)
    .eq('student_id', student.id)
    .maybeSingle()

  if (existing) return { error: 'You already signed in for this session.' }
  if (!isSessionActive(session)) {
    return { error: 'This session has ended. You can no longer sign in.' }
  }

  const { data, error } = await supabase
    .from('session_sign_ins')
    .insert({
      session_id: session.id,
      student_id: student.id,
      student_name: student.name,
      matric: student.matric,
      status: 'Present',
    })
    .select()
    .single()
  if (error) throw error

  const today = getTodayDate()
  await supabase.from('attendance_records').upsert(
    {
      student_id: student.id,
      student_name: student.name,
      matric: student.matric,
      course: student.course,
      status: 'Present',
      date: today,
      session_id: session.id,
    },
    { onConflict: 'student_id,date' }
  )
  window.dispatchEvent(new Event('attendance-updated'))

  return { signIn: mapSignIn(data) }
}

async function supabaseFindSessionByCode(code) {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('status', 'active')
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const session = mapSession(data)
  return isSessionActive(session) ? session : null
}

// ─── Public API ──────────────────────────────────────────────

export async function fetchSessions() {
  if (isSupabaseConfigured) return supabaseFetchSessions()
  return localFetchSessions()
}

export async function fetchSignIns() {
  if (isSupabaseConfigured) return supabaseFetchSignIns()
  return localFetchSignIns()
}

export async function startSession(teacher, options) {
  if (isSupabaseConfigured) return supabaseStartSession(teacher, options)
  return localStartSession(teacher, options)
}

export async function endSession(sessionId) {
  if (isSupabaseConfigured) return supabaseEndSession(sessionId)
  return localEndSession(sessionId)
}

export async function signInToSession(session, student) {
  if (isSupabaseConfigured) return supabaseSignIn(session, student)
  return localSignIn(session, student)
}

export async function findSessionByCode(code) {
  if (isSupabaseConfigured) return supabaseFindSessionByCode(code)
  return localFindSessionByCode(code)
}

export async function clearSessionData() {
  if (isSupabaseConfigured) {
    await supabase.from('session_sign_ins').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('attendance_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    return
  }
  clearSessions()
}
