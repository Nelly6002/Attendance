import { GraduationCap } from 'lucide-react'

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-14 w-14 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 dark:border-brand-900 dark:border-t-brand-400" />
        <GraduationCap className="absolute inset-0 m-auto h-6 w-6 text-brand-600 dark:text-brand-400" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}
