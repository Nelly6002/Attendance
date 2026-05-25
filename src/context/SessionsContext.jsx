import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchSessions,
  fetchSignIns,
  startSession as startSessionApi,
  endSession as endSessionApi,
  signInToSession,
  findSessionByCode,
} from '../services/sessionService'
import { isSessionActive } from '../utils/sessions'
import { useToast } from './ToastContext'

const SessionsContext = createContext(null)

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState([])
  const [signIns, setSignIns] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadSessions = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [sessionsData, signInsData] = await Promise.all([
        fetchSessions(),
        fetchSignIns(),
      ])
      setSessions(sessionsData)
      setSignIns(signInsData)
    } catch (err) {
      if (!silent) toast(err.message, 'error')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadSessions()
    const interval = setInterval(() => loadSessions(true), 4000)
    return () => clearInterval(interval)
  }, [loadSessions])

  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) =>
        prev.map((s) =>
          s.status === 'active' && !isSessionActive(s)
            ? { ...s, status: 'expired' }
            : s
        )
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const startSession = useCallback(
    async (teacher, options) => {
      try {
        const session = await startSessionApi(teacher, options)
        setSessions((prev) => [session, ...prev])
        toast('Attendance session started')
        return session
      } catch (err) {
        toast(err.message, 'error')
        return null
      }
    },
    [toast]
  )

  const endSession = useCallback(
    async (sessionId) => {
      try {
        const updated = await endSessionApi(sessionId)
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, ...updated, status: 'ended' } : s))
        )
        toast('Session ended')
        return true
      } catch (err) {
        toast(err.message, 'error')
        return false
      }
    },
    [toast]
  )

  const studentSignIn = useCallback(
    async (session, student) => {
      const result = await signInToSession(session, student)
      if (result.error) {
        toast(result.error, 'error')
        return false
      }
      setSignIns((prev) => [result.signIn, ...prev])
      window.dispatchEvent(new Event('attendance-updated'))
      toast('Attendance signed successfully!')
      return true
    },
    [toast]
  )

  const lookupSession = useCallback(async (code) => {
    try {
      return await findSessionByCode(code)
    } catch (err) {
      toast(err.message, 'error')
      return null
    }
  }, [toast])

  const getSessionSignIns = useCallback(
    (sessionId) => signIns.filter((s) => s.sessionId === sessionId),
    [signIns]
  )

  const activeSessions = sessions.filter(isSessionActive)

  return (
    <SessionsContext.Provider
      value={{
        sessions,
        signIns,
        activeSessions,
        loading,
        startSession,
        endSession,
        studentSignIn,
        lookupSession,
        getSessionSignIns,
        refresh: loadSessions,
      }}
    >
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessions() {
  const ctx = useContext(SessionsContext)
  if (!ctx) throw new Error('useSessions must be used within SessionsProvider')
  return ctx
}
