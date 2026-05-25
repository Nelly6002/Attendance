import { useState } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { Menu, Moon, Sun, LogOut, ClipboardCheck, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from '../components/BrandLogo'
import { SHORT_NAME } from '../config/branding'

export default function StudentLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login/student')
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-[#050a08]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <BrandLogo compact />
          <div className="flex items-center gap-1">
            <button type="button" onClick={toggleTheme} className="btn-ghost !p-2" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-ghost !p-2 hidden sm:flex"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="btn-ghost !p-2 sm:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <nav
          className={`mx-auto max-w-3xl border-t border-slate-100 px-4 py-2 dark:border-slate-800 ${
            menuOpen ? 'block' : 'hidden sm:block'
          }`}
        >
          <NavLink
            to="/student"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400'
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            <ClipboardCheck className="h-4 w-4" />
            Sign attendance
          </NavLink>
          <p className="mt-2 text-xs text-slate-500 sm:mt-0 sm:ml-4 sm:inline">
            {user?.name} · {user?.matric}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 block w-full rounded-lg py-2 text-left text-sm text-slate-600 sm:hidden"
          >
            Sign out
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl p-4 lg:p-8">
        <p className="mb-4 text-xs font-medium text-slate-500">{SHORT_NAME} · Student</p>
        <Outlet />
      </main>
    </div>
  )
}
