import { Link } from 'react-router-dom'
import {
  ClipboardCheck,
  BarChart3,
  Users,
  FileDown,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { UNIVERSITY, APP_TAGLINE } from '../config/branding'

const features = [
  {
    icon: ClipboardCheck,
    title: 'Live class sessions',
    desc: 'Lecturers open a session in class; students sign in with a short code before time runs out.',
  },
  {
    icon: Clock,
    title: 'Timed sign-in',
    desc: 'Attendance only counts while the session is active — fair and aligned with lecture hours.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard & reports',
    desc: 'See who attended today, review history, and export records when you need them.',
  },
  {
    icon: Users,
    title: 'Student roster',
    desc: 'Manage matric numbers and courses in one place for your department.',
  },
  {
    icon: FileDown,
    title: 'Export records',
    desc: 'Download attendance as CSV or PDF for departmental records.',
  },
  {
    icon: Shield,
    title: 'Secure access',
    desc: 'Separate sign-in for staff and students — each role sees only what they need.',
  },
]

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="hero-mesh relative px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8 lg:pt-22">
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl animate-fade-in">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">
              {UNIVERSITY}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Class attendance, made simple
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/90">
              {APP_TAGLINE}. Lecturers start a session; students sign in with a code while class is in session.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/login/teacher"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-brand-900 shadow-lg transition hover:bg-brand-50"
              >
                Staff sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register/student"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 font-semibold transition hover:bg-white/10"
              >
                Student register
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How it works on campus</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Built for everyday use in lecture halls and labs at {UNIVERSITY}.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="surface-elevated p-6 transition hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
            Three steps each lecture
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Lecturer starts session',
                desc: 'Sign in as staff, open a new session, and share the code with the class.',
              },
              {
                step: '2',
                title: 'Students sign in',
                desc: 'Students enter their matric number and mark present while the session is open.',
              },
              {
                step: '3',
                title: 'Records saved',
                desc: 'Attendance is stored automatically for reports and follow-up.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="surface-elevated flex flex-col items-center gap-6 px-8 py-12 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Need help signing in?</h2>
            <p className="mt-2 text-sm text-slate-500">
              Contact your course lecturer or the faculty office if your matric is not on the list.
            </p>
          </div>
          <Link to="/contact" className="btn-primary shrink-0">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  )
}
