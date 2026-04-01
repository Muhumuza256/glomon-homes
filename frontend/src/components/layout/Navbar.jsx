import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle, Facebook, Instagram, Twitter, Youtube, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

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
  const { dark, toggle } = useTheme()

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
      <div className="bg-[#1A1A1A] dark:bg-black text-white/75 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a href="tel:+256700000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={11} />
              +256 700 000 000
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle size={11} />
              WhatsApp Us
            </a>
          </div>
          <div className="flex items-center gap-3.5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook"><Facebook size={12} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram"><Instagram size={12} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter size={12} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube"><Youtube size={12} /></a>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ───────────────────────────────────────────────────── */}
      <div className={`transition-all duration-300 ${
        transparent
          ? 'bg-black/20 backdrop-blur-sm'
          : 'bg-surface dark:bg-[#1a1a1a] shadow-sm border-b border-border/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            {/* Wordmark */}
            <Link to="/" className="flex flex-col leading-none group">
              <span className={`font-display font-bold text-[18px] tracking-[0.05em] transition-colors ${
                transparent ? 'text-white' : 'text-[#1A1A1A] dark:text-white'
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
                          : 'text-[#1A1A1A] dark:text-white font-semibold'
                        : transparent
                          ? 'text-white/75 hover:text-white'
                          : 'text-text-muted hover:text-[#1A1A1A] dark:hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/listings"
                className="ml-4 px-5 py-2 text-[13px] font-semibold bg-[#1A1A1A] dark:bg-white hover:bg-accent text-white dark:text-[#1A1A1A] dark:hover:text-white rounded-btn transition-colors tracking-wide"
              >
                Browse Properties
              </Link>
            </div>

            {/* Right: dark toggle + mobile menu */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className={`p-2 rounded-btn transition-colors ${
                  transparent
                    ? 'text-white/70 hover:text-white'
                    : 'text-text-muted hover:text-text-main hover:bg-border/40'
                }`}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

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
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────────────── */}
      {open && (
        <div className="md:hidden bg-surface dark:bg-[#1a1a1a] border-t border-border shadow-lg">
          <div className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-btn text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1A1A1A]/5 dark:bg-white/10 text-[#1A1A1A] dark:text-white font-semibold'
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
