import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun } from 'lucide-react'
import { SHORT_NAME } from '../config/branding'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

const titles = {
  dashboard: 'Dashboard',
  session: 'Live Session',
  attendance: 'Manual Attendance',
  'attendance-records': 'Attendance Records',
  students: 'Student Management',
  settings: 'Settings',
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toggleTheme, theme, user } = useAuth()
  const location = useLocation()
  const segment = location.pathname.split('/').filter(Boolean)[0] || 'dashboard'
  const pageTitle = titles[segment] || (segment.startsWith('students') ? 'Student Profile' : 'Dashboard')

  return (
    <div className="flex min-h-screen bg-[#f4f7fc] dark:bg-[#070b14]">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-ghost !p-2 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium text-slate-500">{SHORT_NAME} · Staff</p>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="btn-ghost !p-2">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 sm:flex dark:bg-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user?.name}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
