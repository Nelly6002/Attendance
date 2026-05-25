export default function PageHeader({ title, description, children, badge }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="animate-fade-in">
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-xl text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
