export function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function isSessionActive(session) {
  if (!session || session.status !== 'active') return false
  return new Date(session.endsAt) > new Date()
}

export function getSessionTimeLeft(session) {
  if (!session) return 0
  const ms = new Date(session.endsAt) - new Date()
  return Math.max(0, ms)
}

export function formatTimeLeft(ms) {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export function getActiveSessions(sessions) {
  return sessions.filter(isSessionActive)
}
