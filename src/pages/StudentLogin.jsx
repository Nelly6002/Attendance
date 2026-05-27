import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { UNIVERSITY } from '../config/branding'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function StudentLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const { loginStudent } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    if (demoMode) {
      // Demo mode - instant login
      const demoStudent = { id: 'student-demo', name: 'John Doe', email: form.email || 'student@school.edu', role: 'student', matric: 'LCU/CSC/2024/001', course: 'Computer Science' }
      setForm({ email: '', password: '' })
      toast('Demo mode - logged in as student')
      setTimeout(() => navigate('/student'), 300)
      return
    }
    
    const result = await loginStudent(form.email, form.password)
    setSubmitting(false)
    if (result.success) {
      toast('Welcome back')
      navigate('/student')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="flex min-h-[80vh]">
      <div className="hidden w-1/2 hero-mesh lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="max-w-md text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">{UNIVERSITY}</p>
          <h2 className="mt-3 text-3xl font-bold">Student sign in</h2>
          <p className="mt-4 text-brand-100/90">
            Sign in with the email and password you used when you registered. Mark attendance when your lecturer opens a session.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-16 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="surface-elevated mt-4 p-8">
            <h1 className="text-2xl font-bold">Student sign in</h1>
            <p className="mt-1 text-sm text-slate-500">Email and password from registration</p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-900 dark:bg-blue-950/30">
              <input
                type="checkbox"
                id="demoMode"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300"
              />
              <label htmlFor="demoMode" className="cursor-pointer text-sm text-blue-700 dark:text-blue-300">
                <strong>Demo Mode</strong> - Test without Supabase (while rate-limited)
              </label>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                    className="input !pl-10"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="inline h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              New student?{' '}
              <Link to="/register/student" className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
