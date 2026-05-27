import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { UNIVERSITY } from '../config/branding'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const { register } = useAuth()
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
    const result = await register(form)
    setSubmitting(false)
    if (result.success) {
      toast(result.message || 'Account created')
      if (result.message?.toLowerCase().includes('email') || result.message?.toLowerCase().includes('confirm')) {
        setRegisteredEmail(form.email)
      } else {
        navigate('/dashboard')
      }
    } else {
      setError(result.message)
    }
  }

  if (registeredEmail) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md animate-fade-in surface-elevated p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <Mail className="h-8 w-8 animate-bounce text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Verify your email</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            We have sent a verification link to <strong className="text-slate-900 dark:text-white">{registeredEmail}</strong>.
          </p>
          <div className="mt-6 rounded-xl bg-blue-50/50 p-4 text-left border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Next Steps:</h3>
            <ul className="mt-2 list-disc pl-4 text-xs text-blue-700/90 space-y-1.5 dark:text-blue-300/80">
              <li>Open your email and locate the confirmation link.</li>
              <li>Click the verification link to confirm your account.</li>
              <li>Once verified, click the button below to sign in.</li>
            </ul>
          </div>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Didn't receive it? Check your <span className="font-semibold text-slate-500 dark:text-slate-400">Spam/Junk</span> folder.
          </p>
          <Link to="/login/teacher" className="btn-primary mt-8 w-full">
            Proceed to Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh]">
      <div className="hidden w-1/2 hero-mesh lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="max-w-md text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">{UNIVERSITY}</p>
          <h2 className="mt-3 text-3xl font-bold">Staff registration</h2>
          <p className="mt-4 text-brand-100/90">
            For lecturers and faculty who need to run class attendance sessions.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-16 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/login/teacher" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          <div className="surface-elevated mt-4 p-8">
            <h1 className="text-2xl font-bold">Create staff account</h1>
            <p className="mt-1 text-sm text-slate-500">Lecturers and administrators only</p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {[
                { name: 'name', label: 'Full name', icon: User, type: 'text', placeholder: 'Dr. Jane Adebayo' },
                { name: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'name@leadcity.edu.ng' },
                { name: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: 'At least 6 characters' },
                { name: 'confirmPassword', label: 'Confirm password', icon: Lock, type: 'password', placeholder: 'Repeat password' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="label">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={field.type}
                      required
                      minLength={field.name.includes('password') ? 6 : undefined}
                      className="input !pl-10"
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={submitting} className="btn-primary w-full !mt-6">
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already registered?{' '}
              <Link to="/login/teacher" className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
