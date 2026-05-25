import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import { getTodayDate } from '../utils/attendance'
import PageHeader from '../components/ui/PageHeader'
import Loader from '../components/Loader'
import EmptyState from '../components/ui/EmptyState'

const buttons = [
  { status: 'Present', icon: CheckCircle, class: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25' },
  { status: 'Absent', icon: XCircle, class: 'bg-red-600 hover:bg-red-500 shadow-red-600/25' },
  { status: 'Late', icon: Clock, class: 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25' },
]

export default function MarkAttendance() {
  const { students, attendance, loading, markAttendance } = useStudents()
  const [search, setSearch] = useState('')
  const today = getTodayDate()

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.matric.toLowerCase().includes(search.toLowerCase())
  )

  const getTodayStatus = (id) =>
    attendance.find((r) => r.studentId === id && r.date === today)?.status

  if (loading) return <Loader message="Loading students..." />

  return (
    <div className="space-y-6">
      <PageHeader
        badge={today}
        title="Mark Attendance"
        description="Select a status for each student. Changes save automatically."
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search by name or matric..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input !pl-10"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((student) => {
          const current = getTodayStatus(student.id)
          return (
            <div
              key={student.id}
              className="surface-elevated flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                  <p className="font-mono text-xs text-slate-500">{student.matric}</p>
                  {current && (
                    <span
                      className={`mt-1 inline-block text-xs font-semibold ${
                        current === 'Present' ? 'text-emerald-600' : current === 'Absent' ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      Marked: {current}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {buttons.map((btn) => (
                  <button
                    key={btn.status}
                    type="button"
                    onClick={() => markAttendance(student.id, btn.status)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition active:scale-95 ${btn.class} ${
                      current === btn.status ? 'ring-2 ring-offset-2 ring-white/50' : ''
                    }`}
                  >
                    <btn.icon className="h-4 w-4" />
                    {btn.status}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {!filtered.length && (
        <EmptyState title="No students found" description="Try a different search term." />
      )}
    </div>
  )
}
