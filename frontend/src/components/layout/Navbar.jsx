import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle, Instagram } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const WA_NUMBER = '256704079274'

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const transparent = isHome && !scrolled

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* ── Slim top bar ───────────────────────────────────────────────────── */}
      <div className="bg-[#1A1A1A] text-white/80 text-[12.5px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="tel:+256704079274" className="flex items-center gap-2 hover:text-white transition-colors font-medium">
              <Phone size={14} />
              +256 704 079274
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 hover:text-white transition-colors font-medium"
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/glomon_homes_co._ltd?igsh=MTUzbWpzN3RlNzk4Nw=="
              target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.tiktok.com/@glomon_homes_co_ltd?_r=1&_t=ZS-95BXoIeagLZ"
              target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ───────────────────────────────────────────────────── */}
      <div className={`transition-all duration-300 ${
        transparent
          ? 'bg-black/20 backdrop-blur-sm'
          : 'bg-surface shadow-sm border-b border-border/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            {/* Wordmark */}
            <Link to="/" className="flex flex-col leading-none">
              <span className={`font-display font-bold text-[18px] tracking-[0.05em] transition-colors ${
                transparent ? 'text-white' : 'text-[#1A1A1A]'
              }`}>
                GLOMON<span className="text-accent"> HOMES</span>
              </span>
              <span className={`text-[7px] font-semibold tracking-[0.35em] uppercase transition-colors ${
                transparent ? 'text-white/50' : 'text-text-muted/70'
              }`}>
                Real Estate Uganda
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-btn ${
                      isActive
                        ? transparent
                          ? 'text-white font-semibold'
                          : 'text-[#1A1A1A] font-semibold'
                        : transparent
                          ? 'text-white/75 hover:text-white'
                          : 'text-text-muted hover:text-[#1A1A1A]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/listings"
                className="ml-4 px-5 py-2 text-[13px] font-semibold bg-[#1A1A1A] hover:bg-accent text-white rounded-btn transition-colors tracking-wide"
              >
                Browse Properties
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-2 rounded-btn transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'text-text-main hover:bg-border/30'
              }`}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────────────── */}
      {open && (
        <div className="md:hidden bg-surface border-t border-border shadow-lg">
          <div className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-btn text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1A1A1A]/5 text-[#1A1A1A] font-semibold'
                      : 'text-text-muted hover:text-text-main hover:bg-border/30'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 pb-1">
              <Link
                to="/listings"
                className="block w-full text-center px-4 py-2.5 rounded-btn text-sm font-semibold bg-[#1A1A1A] hover:bg-accent text-white transition-colors tracking-wide"
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
