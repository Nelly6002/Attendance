import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

export default function Navbar() {
  const { user, logout, theme, toggleTheme, isStudent } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo compact />

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          {user ? (
            <>
              <NavLink to={isStudent ? '/student' : '/dashboard'} className={linkClass}>
                <LayoutDashboard className="mr-1 inline h-4 w-4" />
                {isStudent ? 'My attendance' : 'Dashboard'}
              </NavLink>
              <button type="button" onClick={handleLogout} className="btn-ghost ml-1">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-primary ml-2 text-sm">
              Sign in
            </NavLink>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost ml-1 !p-2"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>

        <button type="button" className="btn-ghost !p-2 md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="animate-fade-in border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)} end>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
              About
            </NavLink>
            <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
              Contact
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to={isStudent ? '/student' : '/dashboard'}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {isStudent ? 'My attendance' : 'Dashboard'}
                </NavLink>
                <button type="button" onClick={handleLogout} className="btn-secondary mt-2 w-full">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary mt-2 text-center" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            )}
            <button type="button" onClick={toggleTheme} className="btn-secondary mt-2 w-full">
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
