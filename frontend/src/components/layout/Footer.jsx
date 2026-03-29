import { Link } from 'react-router-dom'
import { Home, Phone, Mail, MapPin } from 'lucide-react'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Browse Properties' },
  { to: '/listings?type=APARTMENT', label: 'Apartments' },
  { to: '/listings?type=HOUSE', label: 'Houses' },
  { to: '/listings?type=LAND', label: 'Land & Plots' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Home size={17} className="text-accent" />
              </div>
              <span className="font-display font-bold text-xl">Glomon Homes</span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs mb-6">
              Find Your Place in Uganda. Verified property listings across Kampala, Wakiso, Entebbe, Mukono and beyond.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {['f', 'in', 'ig'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-white/65 hover:text-accent text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Get In Touch</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-white/65">
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
                Plot 14, Kampala Road,<br />Kampala, Uganda
              </li>
              <li className="flex items-center gap-3 text-sm text-white/65">
                <Phone size={14} className="shrink-0 text-accent" />
                +256 700 000 000
              </li>
              <li className="flex items-center gap-3 text-sm text-white/65">
                <Mail size={14} className="shrink-0 text-accent" />
                info@glomonhomes.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Glomon Homes. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">Made with care in Uganda 🇺🇬</p>
        </div>
      </div>
    </footer>
  )
}
