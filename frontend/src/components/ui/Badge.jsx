export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/15 text-amber-700',
    sale: 'bg-primary text-white',
    rent: 'bg-accent text-white',
    featured: 'bg-accent text-white',
    active: 'bg-green-100 text-green-700',
    sold: 'bg-red-100 text-red-600',
    rented: 'bg-blue-100 text-blue-600',
    inactive: 'bg-gray-100 text-gray-500',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  )
}
