import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Building2, Mail, LogOut, Home, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/properties', icon: Building2, label: 'Properties' },
  { to: '/admin/enquiries', icon: Mail, label: 'Enquiries' },
]

export default function AdminLayout({ children, title }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-bg">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-56 bg-primary flex flex-col fixed top-0 left-0 h-full z-40 shrink-0">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-5 py-[18px] border-b border-white/10">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center shrink-0">
            <Home size={14} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-display font-bold text-white text-sm">Glomon Homes</p>
            <p className="text-white/40 text-[10px]">Admin Portal</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
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
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-border px-8 py-4 sticky top-0 z-30">
          <h1 className="font-display font-bold text-text-main text-xl">{title}</h1>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
