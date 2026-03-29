import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react'
import logo from '../../assets/logo.svg'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Browse Properties' },
  { to: '/listings?type=APARTMENT', label: 'Apartments' },
  { to: '/listings?type=HOUSE', label: 'Houses' },
  { to: '/listings?type=LAND', label: 'Land & Plots' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const SOCIALS = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
]

const WA_NUMBER = '256700000000'

export default function Footer() {
  return (
    <footer className="bg-[#1A3A6B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <img
                src={logo}
                alt="Glomon Homes"
                className="h-12 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs mb-6">
              Find Your Place in Uganda. Verified property listings across Kampala, Wakiso, Entebbe, Mukono and beyond.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F97316] flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
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
                  <Link
                    to={to}
                    className="text-white/65 hover:text-[#F97316] text-sm transition-colors"
                  >
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
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#F97316]" />
                Plot 45 Kira Road,<br />Kampala, Uganda
              </li>
              <li>
                <a
                  href="tel:+256700000000"
                  className="flex items-center gap-3 text-sm text-white/65 hover:text-[#F97316] transition-colors"
                >
                  <Phone size={14} className="shrink-0 text-[#F97316]" />
                  +256 700 000 000
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/65 hover:text-[#F97316] transition-colors"
                >
                  <MessageCircle size={14} className="shrink-0 text-[#F97316]" />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@glomonhomes.com"
                  className="flex items-center gap-3 text-sm text-white/65 hover:text-[#F97316] transition-colors"
                >
                  <Mail size={14} className="shrink-0 text-[#F97316]" />
                  info@glomonhomes.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © 2025 Glomon Homes. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">Made with care in Uganda 🇺🇬</p>
        </div>
      </div>
    </footer>
  )
}
