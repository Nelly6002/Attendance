import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserPlus, X } from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import StudentCard from '../components/StudentCard'
import PageHeader from '../components/ui/PageHeader'
import Loader from '../components/Loader'
import EmptyState from '../components/ui/EmptyState'
import { getStudentAttendancePercentage } from '../utils/attendance'

export default function Students() {
  const { students, attendance, loading, addStudent, isCloud } = useStudents()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', matric: '', course: '', email: '' })

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.matric.toLowerCase().includes(search.toLowerCase()) ||
      s.course?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await addStudent(form)
    if (result) {
      setForm({ name: '', matric: '', course: '', email: '' })
      setShowForm(false)
    }
  }

  if (loading) return <Loader message="Loading students..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registered students"
        description={
          isCloud
            ? `${students.length} student(s) who registered their own accounts`
            : `${students.length} students in the system`
        }
      >
        {!isCloud && (
          <button type="button" onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Add student
              </>
            )}
          </button>
        )}
      </PageHeader>

      {isCloud && (
        <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100">
          Students add themselves at{' '}
          <Link to="/register/student" className="font-semibold underline">
            student registration
          </Link>
          . They appear here automatically for every lecturer.
        </p>
      )}

      {!isCloud && showForm && (
        <form onSubmit={handleSubmit} className="surface-elevated grid gap-4 p-6 sm:grid-cols-2">
          {[
            { name: 'name', label: 'Full Name', placeholder: 'John Doe' },
            { name: 'matric', label: 'Matric Number', placeholder: 'LCU/CSC/2024/011' },
            { name: 'course', label: 'Course', placeholder: 'Computer Science' },
            { name: 'email', label: 'Email', placeholder: 'john@school.edu', type: 'email' },
          ].map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input
                type={f.type || 'text'}
                required
                className="input"
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              />
            </div>
          ))}
          <button type="submit" className="btn-primary sm:col-span-2">
            Save student
          </button>
        </form>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search by name, matric, course, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input !pl-10"
        />
      </div>

      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((student) => (
            <StudentCard
              key={student.id}
              id={student.id}
              name={student.name}
              matric={student.matric}
              course={student.course}
              status={student.status}
              percentage={getStudentAttendancePercentage(student.id, attendance)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No registered students yet"
          description={
            isCloud
              ? 'Ask students to register at /register/student with their real matric and email.'
              : 'Add a student or switch to Supabase for self-registration.'
          }
        />
      )}
    </div>
  )
}
