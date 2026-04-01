export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-[#1A1A1A]/8 text-[#1A1A1A]',
    primary:  'bg-[#1A1A1A] text-white',
    accent:   'bg-accent/12 text-accent',
    sale:     'bg-[#1A1A1A] text-white',
    rent:     'bg-accent text-white',
    featured: 'bg-amber-400 text-amber-950',
    active:   'bg-emerald-100 text-emerald-700',
    sold:     'bg-red-100 text-red-600',
    rented:   'bg-blue-100 text-blue-600',
    inactive: 'bg-gray-100 text-gray-400',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.04em] ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  )
}
