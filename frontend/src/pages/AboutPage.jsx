import { MapPin, Phone, Mail, Clock, MessageCircle, Shield, Star, TrendingUp, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const STATS = [
  { value: '12+', label: 'Active Listings' },
  { value: '4', label: 'Districts Covered' },
  { value: '200+', label: 'Clients Served' },
  { value: '2024', label: 'Established' },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Integrity',
    desc: 'We operate with complete transparency. Every listing is verified, every price is honest, and every client is treated with respect.',
  },
  {
    icon: Star,
    title: 'Excellence',
    desc: 'We hold ourselves to the highest standard — in the quality of our listings, our service, and the experience we deliver.',
  },
  {
    icon: TrendingUp,
    title: 'Expertise',
    desc: "Deep local knowledge of Uganda's property market is our foundation. We know the neighborhoods, the prices, and the opportunities.",
  },
  {
    icon: Heart,
    title: 'Community',
    desc: 'We are Ugandan-first. Our mission is to help families find homes and investors find opportunity in the land we love.',
  },
]

const HOURS = [
  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
]

const WA_NUMBER = '256781106837' // Glomon Homes WhatsApp number (updated from placeholder)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="bg-primary pt-28 pb-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
            Who We Are
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            About Glomon Homes
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto leading-relaxed">
            Uganda's trusted partner for finding, buying, and renting property.
          </p>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="bg-accent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-white text-3xl md:text-4xl">{value}</p>
                <p className="text-white/80 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Our Story ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main mb-5 leading-tight">
                Built from a Belief That Finding Home Should Be Easier
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Glomon Homes was founded in 2024 with a simple conviction: Uganda's property market deserved better. Too many listings were outdated, prices were opaque, and buyers and renters struggled to find trustworthy information.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                We set out to build something different — a platform where every listing is verified, every agent is accountable, and every client is treated like a valued partner, not just a transaction.
              </p>
              <p className="text-text-muted text-sm leading-relaxed">
                From apartments in Kololo to land plots in Mukono, from city-centre offices to lakeside retreats in Entebbe, we connect people with the properties that change their lives.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-card overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                  alt="A beautiful property in Uganda"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-primary text-white p-5 rounded-card shadow-lg">
                <p className="font-display font-bold text-2xl">Est. 2024</p>
                <p className="text-white/65 text-xs mt-0.5">Kampala, Uganda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary rounded-card p-8">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
              Our Vision
            </p>
            <h3 className="font-display font-bold text-white text-xl mb-3">
              Uganda's Most Trusted Property Platform
            </h3>
            <p className="text-white/65 text-sm leading-relaxed">
              To be the definitive, most-trusted destination for property search across Uganda — where buyers, renters, and investors can find exactly what they need with confidence and ease.
            </p>
          </div>
          <div className="bg-bg border border-border rounded-card p-8">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
              Our Mission
            </p>
            <h3 className="font-display font-bold text-text-main text-xl mb-3">
              Simplify. Verify. Connect.
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              To simplify Uganda's property market by providing verified listings, transparent pricing, and exceptional service — making it easier for every Ugandan to find their perfect place.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Values ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
              What We Stand For
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface rounded-card shadow-card p-6 flex gap-4">
                <div className="w-11 h-11 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-text-main text-base mb-1.5">
                    {title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact & Location ────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-primary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
              Find Us
            </p>
            <h2 className="font-display text-3xl font-bold text-white">
              Location & Contact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="bg-white/5 border border-white/10 rounded-card p-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mb-4">
                <MapPin size={18} className="text-white" />
              </div>
              <h4 className="font-display font-semibold text-white text-base mb-2">Office</h4>
              <p className="text-white/65 text-sm leading-relaxed">
                Plot 45 Kira Road<br />
                Kampala, Uganda
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white/5 border border-white/10 rounded-card p-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mb-4">
                <Phone size={18} className="text-white" />
              </div>
              <h4 className="font-display font-semibold text-white text-base mb-2">Call or WhatsApp</h4>
              <a
                href="tel:+256700000000"
                className="block text-white/65 hover:text-accent text-sm transition-colors mb-1"
              >
                +256 700 000 000
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-green-400 hover:text-green-300 text-sm transition-colors mt-1"
              >
                <MessageCircle size={13} />
                WhatsApp Us
              </a>
            </div>

            {/* Hours */}
            <div className="bg-white/5 border border-white/10 rounded-card p-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mb-4">
                <Clock size={18} className="text-white" />
              </div>
              <h4 className="font-display font-semibold text-white text-base mb-2">Hours</h4>
              <ul className="space-y-1.5">
                {HOURS.map(({ day, time }) => (
                  <li key={day} className="text-sm">
                    <span className="text-white/50">{day}</span>
                    <br />
                    <span className="text-white/80">{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Email row */}
          <div className="mt-6 text-center">
            <a
              href="mailto:info@glomonhomes.com"
              className="inline-flex items-center gap-2 text-white/65 hover:text-accent text-sm transition-colors"
            >
              <Mail size={14} />
              info@glomonhomes.com
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-accent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Ready to Find Your Place?
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            Browse our verified listings or get in touch — we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-btn hover:bg-gray-50 transition-colors text-sm shadow"
            >
              Browse Listings
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-btn transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
