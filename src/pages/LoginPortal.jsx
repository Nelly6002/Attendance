import { Link } from 'react-router-dom'
import { UserCircle, BookOpen, ArrowRight } from 'lucide-react'
import BrandLogo from '../components/BrandLogo'
import { UNIVERSITY } from '../config/branding'

export default function LoginPortal() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <BrandLogo linked={false} />
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Sign in</h1>
          <p className="mt-2 text-slate-500">{UNIVERSITY} attendance portal</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Link
            to="/login/teacher"
            className="surface-elevated group flex flex-col p-7 transition hover:border-brand-300 dark:hover:border-brand-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-900/50">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">Staff / Lecturer</h2>
            <p className="mt-2 flex-1 text-sm text-slate-500">
              Start sessions, view sign-ins, and manage attendance records.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-400">
              Continue
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            to="/login/student"
            className="surface-elevated group flex flex-col p-7 transition hover:border-brand-300 dark:hover:border-brand-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
              <UserCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">Student</h2>
            <p className="mt-2 flex-1 text-sm text-slate-500">
              Register once with your details, then sign in to mark attendance in class.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-400">
              Continue
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link to="/" className="font-medium text-brand-700 hover:underline dark:text-brand-400">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
