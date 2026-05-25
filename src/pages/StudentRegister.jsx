import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Hash, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { UNIVERSITY } from '../config/branding'
import { COURSES } from '../config/courses'

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    matric: '',
    course: COURSES[0],
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { registerStudent } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError('')
    const result = await registerStudent(form)
    setSubmitting(false)
    if (result.success) {
      toast(result.message || 'Registered successfully')
      navigate(result.message?.includes('email') ? '/login/student' : '/student')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="flex min-h-[80vh]">
      <div className="hidden w-1/2 hero-mesh lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="max-w-md text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">{UNIVERSITY}</p>
          <h2 className="mt-3 text-3xl font-bold">Student registration</h2>
          <p className="mt-4 text-brand-100/90">
            Create your account with your real details. Your lecturer will see you in the class list once you register.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-16 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/login/student" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          <div className="surface-elevated mt-4 p-8">
            <h1 className="text-2xl font-bold">Create student account</h1>
            <p className="mt-1 text-sm text-slate-500">Use your real name, matric, and email</p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="input !pl-10"
                    placeholder="Adaobi Okonkwo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Matric number</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="input !pl-10 font-mono"
                    placeholder="LCU/CSC/2024/001"
                    value={form.matric}
                    onChange={(e) => setForm({ ...form, matric: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Course / programme</label>
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
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="input !pl-10"
                    placeholder="you@student.leadcity.edu.ng"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input !pl-10"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input !pl-10"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full !mt-6">
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Register
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already registered?{' '}
              <Link to="/login/student" className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
