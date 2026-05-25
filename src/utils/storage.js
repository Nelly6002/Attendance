const ATTENDANCE_KEY = 'attendance'
const AUTH_KEY = 'authUser'
const STUDENTS_KEY = 'students'
const THEME_KEY = 'theme'
const SESSIONS_KEY = 'attendanceSessions'
const SIGN_INS_KEY = 'sessionSignIns'

export function getAttendance() {
  try {
    const data = localStorage.getItem(ATTENDANCE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveAttendance(records) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records))
}

export function getStoredStudents() {
  try {
    const data = localStorage.getItem(STUDENTS_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveStudents(students) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
}

export function getAuthUser() {
  try {
    const data = localStorage.getItem(AUTH_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setAuthUser(user) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
  document.body.classList.toggle('dark', theme === 'dark')
}

export function initTheme() {
  const theme = getTheme()
  document.body.classList.toggle('dark', theme === 'dark')
  return theme
}

export function getSessions() {
  try {
    const data = localStorage.getItem(SESSIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function getSignIns() {
  try {
    const data = localStorage.getItem(SIGN_INS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveSignIns(signIns) {
  localStorage.setItem(SIGN_INS_KEY, JSON.stringify(signIns))
}

export function clearSessions() {
  localStorage.removeItem(SESSIONS_KEY)
  localStorage.removeItem(SIGN_INS_KEY)
}
