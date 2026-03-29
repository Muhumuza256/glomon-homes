import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import logo from '../../assets/logo.svg'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const WA_NUMBER = '256700000000'

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
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top banner ─────────────────────────────────────────────────────── */}
      <div className="bg-[#1A3A6B] text-white/90 text-[12px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="tel:+256700000000"
              className="flex items-center gap-1.5 hover:text-[#F97316] transition-colors"
            >
              <Phone size={12} />
              +256 700 000 000
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#F97316] transition-colors"
            >
              <MessageCircle size={12} />
              WhatsApp Us
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316] transition-colors" aria-label="Facebook">
              <Facebook size={13} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316] transition-colors" aria-label="Instagram">
              <Instagram size={13} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316] transition-colors" aria-label="Twitter">
              <Twitter size={13} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316] transition-colors" aria-label="YouTube">
              <Youtube size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ───────────────────────────────────────────────────── */}
      <div
        className={`transition-all duration-300 ${
          transparent ? 'bg-transparent' : 'bg-white shadow-card border-b border-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Glomon Homes"
                className="h-10 w-auto"
                style={transparent ? { filter: 'brightness(0) invert(1)' } : undefined}
              />
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
              className={`md:hidden p-2 rounded-btn transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-primary/5'
              }`}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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
