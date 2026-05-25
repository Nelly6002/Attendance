import { Link } from 'react-router-dom'
import { ChevronRight, User } from 'lucide-react'

function StatusBadge({ status }) {
  const map = {
    Present: 'badge-present',
    Absent: 'badge-absent',
    Late: 'badge-late',
  }
  return (
    <span className={map[status] || 'badge-present'}>{status || 'N/A'}</span>
  )
}

export default function StudentCard({ id, name, matric, course, status, percentage }) {
  return (
    <div className="surface-elevated group flex flex-col gap-4 p-5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-lg font-bold text-brand-800 dark:from-brand-900 dark:to-brand-800 dark:text-brand-300">
          {name?.charAt(0) || <User className="h-5 w-5" />}
        </div>
        <StatusBadge status={status} />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{matric}</p>
        <p className="mt-0.5 text-xs text-slate-500">{course}</p>
      </div>

      {percentage !== undefined && (
        <div>
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-slate-500">Attendance rate</span>
            <span className="font-bold text-brand-700 dark:text-brand-400">{percentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      <Link
        to={`/students/${id}`}
        className="mt-auto flex items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-brand-700 transition group-hover:bg-brand-50 dark:bg-slate-800 dark:text-brand-400 dark:group-hover:bg-brand-950/50"
      >
        View Profile
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
