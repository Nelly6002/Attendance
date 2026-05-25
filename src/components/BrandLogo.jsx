import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { UNIVERSITY, SHORT_NAME } from '../config/branding'

export default function BrandLogo({ linked = true, compact = false, light = false }) {
  const content = (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-md shadow-brand-900/20">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="min-w-0 text-left">
        <span
          className={`block truncate text-base font-bold leading-tight ${
            light ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          {compact ? SHORT_NAME : UNIVERSITY}
        </span>
        {!compact && (
          <span
            className={`block truncate text-xs font-medium ${
              light ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Attendance Portal
          </span>
        )}
      </div>
    </div>
  )

  if (linked) {
    return (
      <Link to="/" className="group transition-opacity hover:opacity-90">
        {content}
      </Link>
    )
  }

  return content
}
