import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Home } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const transparent = isHome && !scrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white shadow-card border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${transparent ? 'bg-white/15' : 'bg-primary'}`}>
              <Home size={15} className={transparent ? 'text-accent' : 'text-white'} />
            </div>
            <span className={`font-display font-bold text-lg leading-none transition-colors ${transparent ? 'text-white' : 'text-primary'}`}>
              Glomon Homes
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-btn text-sm font-medium transition-colors ${
                    isActive
                      ? transparent
                        ? 'text-white bg-white/15'
                        : 'text-primary bg-primary/5'
                      : transparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-text-main hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/listings"
              className="ml-3 px-4 py-2 rounded-btn text-sm font-semibold bg-accent hover:bg-accent-hover text-white transition-colors"
            >
              Browse Properties
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-2 rounded-btn transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-primary/5'}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-border shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-btn text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary/5 text-primary' : 'text-text-main hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2">
              <Link
                to="/listings"
                className="block w-full text-center px-4 py-2.5 rounded-btn text-sm font-semibold bg-accent hover:bg-accent-hover text-white transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
