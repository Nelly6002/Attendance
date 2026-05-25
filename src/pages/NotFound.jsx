import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[120px] font-black leading-none text-brand-100 dark:text-brand-950">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    </div>
  )
}
