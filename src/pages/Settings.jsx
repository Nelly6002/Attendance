import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import PageHeader from '../components/ui/PageHeader'
import { User, Moon, LogOut } from 'lucide-react'

export default function Settings() {
  const { user, theme, toggleTheme, logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    await logout()
    toast('Signed out successfully')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Your account and display preferences."
      />

      <div className="surface-elevated p-6">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-brand-600" />
          <h3 className="font-semibold">Account</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email || user?.matric}</p>
            <span className="mt-1 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
              {user?.role === 'teacher' ? 'Staff' : user?.role}
            </span>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-secondary mt-6">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <div className="surface-elevated p-6">
        <div className="mb-4 flex items-center gap-2">
          <Moon className="h-5 w-5 text-brand-600" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
          </p>
          <button type="button" onClick={toggleTheme} className="btn-primary">
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
        </div>
      </div>
    </div>
  )
}
