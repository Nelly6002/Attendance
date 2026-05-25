import { useState } from 'react'
import { CheckCircle, Hash, Loader2, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSessions } from '../context/SessionsContext'
import { useStudents } from '../context/StudentsContext'
import { useToast } from '../context/ToastContext'
import { isSessionActive, getSessionTimeLeft, formatTimeLeft } from '../utils/sessions'
import { sameStudentId } from '../utils/ids'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Loader from '../components/Loader'

export default function StudentCheckIn() {
  const { user } = useAuth()
  const { activeSessions, studentSignIn, lookupSession, signIns, loading } = useSessions()
  const { students, loading: studentsLoading } = useStudents()
  const { toast } = useToast()
  const [code, setCode] = useState('')
  const [lookingUp, setLookingUp] = useState(false)
  const [signing, setSigning] = useState(null)

  const student =
    students.find((s) => sameStudentId(s.id, user?.studentId)) ||
    (user?.studentId
      ? {
          id: user.studentId,
          name: user.name,
          matric: user.matric,
          course: user.course,
        }
      : null)

  const mySignIns = signIns.filter((s) => sameStudentId(s.studentId, user?.studentId))

  const handleCodeJoin = async (e) => {
    e.preventDefault()
    if (!student) {
      toast('Student profile not loaded. Try again.', 'error')
      return
    }
    setLookingUp(true)
    const session = await lookupSession(code.trim())
    setLookingUp(false)
    if (!session) {
      toast('Invalid or expired session code.', 'error')
      return
    }
    await handleSignIn(session)
  }

  const handleSignIn = async (session) => {
    if (!student) {
      toast('Student profile not loaded.', 'error')
      return
    }
    setSigning(session.id)
    await studentSignIn(session, student)
    setSigning(null)
  }

  const alreadySigned = (sessionId) =>
    mySignIns.some((s) => s.sessionId === sessionId)

  if (loading && studentsLoading) {
    return <Loader message="Loading sessions..." />
  }

  if (!student) {
    return (
      <EmptyState
        title="Profile not found"
        description="Your matric is not in the student list. Ask your teacher to add you."
      />
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader
        title="Sign attendance"
        description={`Signed in as ${student.name} (${student.matric})`}
      />

      <form onSubmit={handleCodeJoin} className="surface-elevated p-6">
        <label className="label">Session code</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              maxLength={6}
              required
              className="input !pl-10 font-mono uppercase"
              placeholder="ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <button type="submit" disabled={lookingUp || code.length < 6} className="btn-primary shrink-0">
            {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Join'}
          </button>
        </div>
      </form>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-500">Open sessions</h2>
        {activeSessions.length ? (
          <ul className="space-y-3">
            {activeSessions.map((session) => {
              const signed = alreadySigned(session.id)
              const left = formatTimeLeft(getSessionTimeLeft(session))
              return (
                <li key={session.id} className="surface-elevated p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{session.title}</p>
                      <p className="text-sm text-slate-500">{session.course}</p>
                      <p className="mt-1 font-mono text-xs text-brand-600">{session.code}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                      <Clock className="h-3 w-3" />
                      {left}
                    </span>
                  </div>
                  {signed ? (
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      You signed in for this session
                    </p>
                  ) : isSessionActive(session) ? (
                    <button
                      type="button"
                      disabled={signing === session.id}
                      onClick={() => handleSignIn(session)}
                      className="btn-primary mt-4 w-full"
                    >
                      {signing === session.id ? 'Signing in...' : 'Sign attendance'}
                    </button>
                  ) : (
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
                      <AlertCircle className="h-4 w-4" />
                      Session ended
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            title="No active sessions"
            description="Your teacher has not started a session yet. Check back when class begins."
          />
        )}
      </div>
    </div>
  )
}
