import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react'

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
    </svg>
  )
}

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Browse Properties' },
  { to: '/listings?type=APARTMENT', label: 'Apartments' },
  { to: '/listings?type=HOUSE', label: 'Houses' },
  { to: '/listings?type=LAND', label: 'Land & Plots' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const PROPERTY_TYPES = [
  { to: '/listings?type=APARTMENT', label: 'Apartments' },
  { to: '/listings?type=HOUSE', label: 'Houses' },
  { to: '/listings?type=LAND', label: 'Land & Plots' },
  { to: '/listings?type=COMMERCIAL', label: 'Commercial' },
  { to: '/listings?type=VILLA', label: 'Villas' },
  { to: '/listings?priceType=RENT', label: 'For Rent' },
  { to: '/listings?priceType=SALE', label: 'For Sale' },
]

const WA_NUMBER = '256704079274'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-5 flex items-center gap-3 leading-none">
              <img
                src="/logo-icon.svg"
                alt="Glomon Homes Logo"
                className="h-11 w-auto shrink-0"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-[20px] tracking-[0.05em] text-white">
                  GLOMON<span className="text-accent"> HOMES</span>
                </span>
                <span className="text-[7px] font-semibold tracking-[0.35em] uppercase text-white/35 mt-1">
                  Real Estate Uganda
                </span>
              </div>
            </div>
            <p className="text-white/55 text-[13px] leading-relaxed mb-6 max-w-[240px]">
              Find Your Place in Uganda. Verified listings across Kampala, Wakiso, Entebbe, Mukono and beyond.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/glomon_homes_co._ltd?igsh=MTUzbWpzN3RlNzk4Nw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 hover:border-accent hover:bg-accent flex items-center justify-center transition-all"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.tiktok.com/@glomon_homes_co_ltd?_r=1&_t=ZS-95BXoIeagLZ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-white/15 hover:border-accent hover:bg-accent flex items-center justify-center transition-all"
              >
                <TikTokIcon size={14} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-white text-[13px] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
              Properties
            </h4>
            <ul className="space-y-2.5">
              {PROPERTY_TYPES.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white/60 hover:text-white text-[13px] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
              Contact
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-[13px] text-white/60">
                <MapPin size={13} className="mt-0.5 shrink-0 text-accent" />
                Plot 45 Kira Road,<br />Kampala, Uganda
              </li>
              <li>
                <a
                  href="tel:+256704079274"
                  className="flex items-center gap-3 text-[13px] text-white/60 hover:text-white transition-colors"
                >
                  <Phone size={13} className="shrink-0 text-accent" />
                  +256 704 079274
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[13px] text-white/60 hover:text-white transition-colors"
                >
                  <MessageCircle size={13} className="shrink-0 text-accent" />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@glomonhomes.com"
                  className="flex items-center gap-3 text-[13px] text-white/60 hover:text-white transition-colors"
                >
                  <Mail size={13} className="shrink-0 text-accent" />
                  info@glomonhomes.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-[11px]">
            © {new Date().getFullYear()} Glomon Homes. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/listings" className="text-white/30 hover:text-white/60 text-[11px] transition-colors">Privacy Policy</Link>
            <Link to="/listings" className="text-white/30 hover:text-white/60 text-[11px] transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
