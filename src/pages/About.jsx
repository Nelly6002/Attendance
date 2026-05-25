import { GraduationCap, Target, Users, BookOpen } from 'lucide-react'
import { UNIVERSITY } from '../config/branding'

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-fade-in text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
          <GraduationCap className="h-4 w-4" />
          {UNIVERSITY}
        </span>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">About this portal</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-500">
          The attendance portal helps {UNIVERSITY} lecturers take roll call digitally and lets students
          confirm presence during an active class session.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {[
          {
            icon: Target,
            title: 'Purpose',
            text: 'Reduce paper registers and give departments accurate, time-stamped attendance records.',
          },
          {
            icon: BookOpen,
            title: 'For lecturers',
            text: 'Start a session at the beginning of class, share the code, and monitor sign-ins in real time.',
          },
          {
            icon: Users,
            title: 'For students',
            text: 'Sign in with your matric number when your lecturer opens the session — only during class time.',
          },
          {
            icon: GraduationCap,
            title: 'For the university',
            text: 'A single system for tracking participation across courses in the Faculty of Computing and related programmes.',
          },
        ].map((item) => (
          <div key={item.title} className="surface-elevated p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-900/50">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
