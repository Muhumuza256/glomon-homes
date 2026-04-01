import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Building2, Mail, CalendarCheck, LogOut, Home, ExternalLink, Menu, X, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/properties', icon: Building2,        label: 'Properties' },
  { to: '/admin/enquiries',  icon: Mail,             label: 'Enquiries' },
  { to: '/admin/visits',     icon: CalendarCheck,    label: 'Visit Bookings' },
  { to: '/admin/settings',   icon: Settings,         label: 'Settings' },
]

function SidebarContent({ onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <>
      {/* Logo + close (mobile only) */}
      <div className="flex items-center justify-between px-4 py-[17px] border-b border-white/10">
        <Link
          to="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center shrink-0">
            <Home size={14} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-display font-bold text-white text-sm">Glomon Homes</p>
            <p className="text-white/40 text-[10px]">Admin Portal</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 text-white/50 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/55 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-0.5 border-t border-white/10 pt-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink size={15} />
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm text-white/50 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>
    </>
  )
}

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-bg">
      {/* ── Desktop sidebar (always visible ≥ md) ────────────────────────── */}
      <aside className="hidden md:flex w-56 bg-[#111111] flex-col fixed top-0 left-0 h-full z-40 shrink-0">
        <SidebarContent onClose={null} />
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#111111] flex flex-col z-50 transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="md:ml-56 flex-1 flex flex-col min-h-screen w-full">
        <header className="bg-surface border-b border-border px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1.5 rounded-btn text-text-muted hover:text-text-main hover:bg-border/40 transition-colors shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-display font-bold text-text-main text-lg sm:text-xl">{title}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
