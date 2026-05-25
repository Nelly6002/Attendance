import EmptyState from './ui/EmptyState'
import { ClipboardList } from 'lucide-react'

function StatusBadge({ status }) {
  const map = { Present: 'badge-present', Absent: 'badge-absent', Late: 'badge-late' }
  return <span className={map[status] || 'badge-present'}>{status}</span>
}

export default function AttendanceTable({ records, showDate = true }) {
  if (!records.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No records found"
        description="Try a different date or mark attendance for today."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="bg-slate-900 text-white dark:bg-brand-950">
              <th className="px-5 py-3.5 font-semibold">#</th>
              <th className="px-5 py-3.5 font-semibold">Student</th>
              <th className="px-5 py-3.5 font-semibold">Matric</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              {showDate && <th className="px-5 py-3.5 font-semibold">Date</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id || `${record.studentId}-${record.date}-${index}`}
                className="border-t border-slate-100 bg-white transition hover:bg-brand-50/30 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-brand-950/20"
              >
                <td className="px-5 py-3.5 text-slate-400">{index + 1}</td>
                <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                  {record.studentName}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                  {record.matric}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={record.status} />
                </td>
                {showDate && (
                  <td className="px-5 py-3.5 text-slate-500">{record.date}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
