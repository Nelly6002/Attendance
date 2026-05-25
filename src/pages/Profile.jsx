import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, BookOpen, Hash } from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import AttendanceTable from '../components/AttendanceTable'
import Loader from '../components/Loader'
import { getStudentAttendancePercentage } from '../utils/attendance'

export default function Profile() {
  const { id } = useParams()
  const { students, attendance, loading } = useStudents()
  const studentId = Number(id)
  const student = students.find((s) => Number(s.id) === studentId)
  const records = attendance
    .filter((r) => Number(r.studentId) === studentId)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (loading) return <Loader message="Loading profile..." />

  if (!student) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center">
        <h2 className="text-xl font-semibold">Student not found</h2>
        <Link to="/students" className="btn-primary mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to students
        </Link>
      </div>
    )
  }

  const percentage = getStudentAttendancePercentage(student.id, attendance)

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/students" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 dark:text-brand-400">
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      <div className="surface-elevated overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600 to-brand-800" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-brand-100 text-3xl font-bold text-brand-800 shadow-lg dark:border-slate-900 dark:bg-brand-900 dark:text-brand-300">
            {student.name.charAt(0)}
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Hash className="h-4 w-4" />{student.matric}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{student.course}</span>
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{student.email}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-brand-50 px-6 py-4 text-center dark:bg-brand-950/50">
              <p className="text-4xl font-bold text-brand-700 dark:text-brand-400">{percentage}%</p>
              <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-elevated p-6">
        <h2 className="mb-4 font-semibold">Attendance History</h2>
        <AttendanceTable records={records} />
      </div>
    </div>
  )
}
