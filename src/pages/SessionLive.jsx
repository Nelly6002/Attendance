import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Copy, StopCircle, Users, Clock, ClipboardList } from 'lucide-react'
import { useSessions } from '../context/SessionsContext'
import { useStudents } from '../context/StudentsContext'
import { isSessionActive, getSessionTimeLeft, formatTimeLeft } from '../utils/sessions'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'
import PageHeader from '../components/ui/PageHeader'

export default function SessionLive() {
  const { id } = useParams()
  const { sessions, getSessionSignIns, endSession, loading } = useSessions()
  const { students } = useStudents()
  const { toast } = useToast()
  const [timeLeft, setTimeLeft] = useState(0)

  const session = sessions.find((s) => s.id === id)
  const signIns = session ? getSessionSignIns(session.id) : []
  const active = session && isSessionActive(session)

  useEffect(() => {
    if (!session) return
    const tick = () => setTimeLeft(getSessionTimeLeft(session))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [session])

  const copyCode = () => {
    if (session?.code) {
      navigator.clipboard.writeText(session.code)
      toast('Session code copied')
    }
  }

  const handleEnd = async () => {
    if (!session || !confirm('End this session now? Students will no longer be able to sign in.')) return
    await endSession(session.id)
  }

  if (loading && !session) return <Loader message="Loading session..." />
  if (!session) {
    return (
      <div className="text-center">
        <p className="text-slate-500">Session not found.</p>
        <Link to="/session/start" className="mt-4 inline-block text-brand-700 hover:underline">
          Start a new session
        </Link>
      </div>
    )
  }

  const signedIds = new Set(signIns.map((s) => String(s.studentId)))
  const notSigned = students.filter((s) => !signedIds.has(String(s.id)))

  return (
    <div className="space-y-6">
      <PageHeader
        badge={active ? 'LIVE' : 'ENDED'}
        title={session.title}
        description={`${session.course} · Code: ${session.code}`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-elevated p-5 text-center">
          <p className="text-3xl font-bold font-mono tracking-widest text-brand-700 dark:text-brand-300">
            {session.code}
          </p>
          <button type="button" onClick={copyCode} className="mt-2 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
            <Copy className="h-3.5 w-3.5" />
            Copy code for students
          </button>
        </div>
        <div className="surface-elevated flex items-center justify-center gap-3 p-5">
          <Clock className="h-8 w-8 text-amber-500" />
          <div>
            <p className="text-xs text-slate-500">Time remaining</p>
            <p className="text-2xl font-bold tabular-nums">
              {active ? formatTimeLeft(timeLeft) : '0:00'}
            </p>
          </div>
        </div>
        <div className="surface-elevated flex items-center justify-center gap-3 p-5">
          <Users className="h-8 w-8 text-emerald-500" />
          <div>
            <p className="text-xs text-slate-500">Signed in</p>
            <p className="text-2xl font-bold">
              {signIns.length} / {students.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {active && (
          <button type="button" onClick={handleEnd} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            <StopCircle className="h-4 w-4" />
            End session now
          </button>
        )}
        <Link to="/attendance" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          <ClipboardList className="h-4 w-4" />
          Mark absent / late manually
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold text-emerald-700 dark:text-emerald-400">
            Signed in ({signIns.length})
          </h2>
          <ul className="space-y-2">
            {signIns.map((s) => (
              <li key={s.id} className="surface-elevated flex justify-between px-4 py-3">
                <span className="font-medium">{s.studentName}</span>
                <span className="font-mono text-xs text-slate-500">{s.matric}</span>
              </li>
            ))}
            {!signIns.length && (
              <p className="text-sm text-slate-500">Waiting for students to sign in...</p>
            )}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 font-semibold text-slate-500">
            Not yet signed ({notSigned.length})
          </h2>
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {notSigned.map((s) => (
              <li key={s.id} className="surface-elevated flex justify-between px-4 py-3 opacity-75">
                <span>{s.name}</span>
                <span className="font-mono text-xs text-slate-500">{s.matric}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
