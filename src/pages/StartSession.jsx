import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSessions } from '../context/SessionsContext'
import PageHeader from '../components/ui/PageHeader'
import { COURSES } from '../config/courses'

const durations = [
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
]

export default function StartSession() {
  const { user } = useAuth()
  const { startSession, activeSessions } = useSessions()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    course: COURSES[0],
    durationMinutes: 15,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)
    const session = await startSession(user, form)
    setSubmitting(false)
    if (session) navigate(`/session/${session.id}`)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="Start Attendance Session"
        description="Open a timed window. Students sign in with the session code until time runs out or you end the session."
      />

      {activeSessions.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          You have {activeSessions.length} active session(s). Starting another will run in parallel.
        </div>
      )}

      <form onSubmit={handleSubmit} className="surface-elevated space-y-5 p-6">
        <div>
          <label className="label">Session title</label>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g. CSC 301 — Week 5 Lecture"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Course</label>
          <select
            className="input"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            {COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Session duration
          </label>
          <select
            className="input"
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
          >
            {durations.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            After this time, students can no longer sign in unless you end the session early.
          </p>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <Play className="h-4 w-4" />
          {submitting ? 'Starting...' : 'Start session'}
        </button>
      </form>
    </div>
  )
}
