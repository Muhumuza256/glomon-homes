export default function Button({ children, variant = 'primary', size = 'md', className = '', as: Tag = 'button', ...props }) {
  const base =
    'inline-flex items-center justify-center font-body font-medium rounded-btn transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    accent: 'bg-accent text-white hover:bg-accent-hover',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary/10',
    white: 'bg-white text-primary hover:bg-gray-50 shadow-sm',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <Tag className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
