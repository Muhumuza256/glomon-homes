export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-[#1A1A1A]/8 text-[#1A1A1A] dark:bg-white/10 dark:text-white/80',
    primary:  'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]',
    accent:   'bg-accent/12 text-accent',
    sale:     'bg-[#1A1A1A] text-white',
    rent:     'bg-accent text-white',
    featured: 'bg-amber-400 text-amber-950',
    active:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    sold:     'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    rented:   'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    inactive: 'bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-white/30',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.04em] ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  )
}
