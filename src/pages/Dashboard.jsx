import { Link } from 'react-router-dom'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Percent,
  ClipboardCheck,
  FileText,
  ArrowRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useStudents } from '../context/StudentsContext'
import { useSessions } from '../context/SessionsContext'
import { calculateStats, getTodayDate } from '../utils/attendance'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { DashboardSkeleton } from '../components/ui/Skeleton'

const COLORS = ['#22c55e', '#ef4444', '#f59e0b']

export default function Dashboard() {
  const { students, attendance, loading } = useStudents()
  const { activeSessions } = useSessions()
  const stats = calculateStats(attendance, students)
  const today = getTodayDate()
  const recentRecords = attendance.filter((r) => r.date === today).slice(0, 6)

  const chartData = [
    { name: 'Present', value: stats.present, fill: COLORS[0] },
    { name: 'Absent', value: stats.absent, fill: COLORS[1] },
    { name: 'Late', value: stats.late, fill: COLORS[2] },
  ]

  const barData = [
    { day: 'Present', count: stats.present },
    { day: 'Absent', count: stats.absent },
    { day: 'Late', count: stats.late },
  ]

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-8">
      <PageHeader
        badge={`Today · ${today}`}
        title="Dashboard Overview"
        description="Monitor attendance performance and take quick actions."
      />

      {activeSessions.length > 0 && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950/40">
          <p className="font-semibold text-brand-900 dark:text-brand-100">
            {activeSessions.length} live session{activeSessions.length > 1 ? 's' : ''}
          </p>
          <ul className="mt-3 space-y-2">
            {activeSessions.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/session/${s.id}`}
                  className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 text-sm transition hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900"
                >
                  <span className="font-medium">{s.title}</span>
                  <span className="font-mono text-brand-700 dark:text-brand-300">{s.code}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} color="brand" />
        <StatCard label="Present Today" value={stats.present} icon={UserCheck} color="emerald" trend={`${stats.marked} marked`} />
        <StatCard label="Absent Today" value={stats.absent} icon={UserX} color="red" />
        <StatCard label="Late Today" value={stats.late} icon={Clock} color="amber" />
        <StatCard label="Attendance Rate" value={`${stats.percentage}%`} icon={Percent} color="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="surface-elevated p-6 lg:col-span-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Today&apos;s Breakdown</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={48}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={entry.day} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-elevated p-6 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">Distribution</h3>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            {chartData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-elevated p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Activity</h3>
            <Link to="/attendance-records" className="flex items-center gap-1 text-sm font-medium text-brand-700 dark:text-brand-400">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentRecords.length ? (
            <ul className="mt-4 space-y-2">
              {recentRecords.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50"
                >
                  <div>
                    <p className="text-sm font-medium">{r.studentName}</p>
                    <p className="text-xs text-slate-500">{r.matric}</p>
                  </div>
                  <span
                    className={
                      r.status === 'Present'
                        ? 'badge-present'
                        : r.status === 'Absent'
                          ? 'badge-absent'
                          : 'badge-late'
                    }
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-center text-sm text-slate-500">
              No attendance marked today.{' '}
              <Link to="/session/start" className="font-medium text-brand-700">Start a session →</Link>
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { to: '/session/start', label: 'Start Session', icon: ClipboardCheck, desc: 'Open sign-in window' },
            { to: '/attendance-records', label: 'View Records', icon: FileText, desc: 'Export reports' },
            { to: '/students', label: 'Students', icon: Users, desc: 'Manage roster' },
            { to: '/settings', label: 'Settings', icon: Percent, desc: 'Preferences' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="surface group flex flex-col gap-3 p-5 transition hover:border-brand-300 hover:shadow-md dark:hover:border-brand-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/50">
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{action.label}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
