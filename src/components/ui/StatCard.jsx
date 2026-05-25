export default function StatCard({ label, value, icon: Icon, trend, color = 'brand' }) {
  const colors = {
    brand: 'from-brand-600 to-brand-800 shadow-brand-600/20',
    emerald: 'from-emerald-500 to-emerald-700 shadow-emerald-500/20',
    red: 'from-red-500 to-red-700 shadow-red-500/20',
    amber: 'from-amber-400 to-amber-600 shadow-amber-500/20',
    violet: 'from-violet-500 to-violet-700 shadow-violet-500/20',
  }

  return (
    <div className="surface-elevated group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 ${colors[color]}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  )
}
