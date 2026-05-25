import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PlayCircle,
  FileText,
  Users,
  Settings,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/session/start', label: 'Start session', icon: PlayCircle },
  { to: '/attendance-records', label: 'Records', icon: FileText },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80'
    }`

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <BrandLogo compact linked={false} />
          <button type="button" onClick={onClose} className="btn-ghost !p-2 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500">Signed in</p>
            <p className="mt-0.5 truncate font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
            <span className="mt-2 inline-block rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
              Staff
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} onClick={onClose}>
              <link.icon className="h-[18px] w-[18px]" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
