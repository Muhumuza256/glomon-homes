import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  Search,
  Shield,
  Star,
  TrendingUp,
  Building2,
  Home as HomeIcon,
  TreePine,
  Store,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PropertyGrid from '../components/properties/PropertyGrid'
import { useFeaturedProperties } from '../hooks/useProperties'

const WHY_US = [
  {
    icon: Shield,
    title: 'Verified Listings',
    desc: 'Every property is manually reviewed. No ghost listings — only real, available properties you can trust.',
  },
  {
    icon: Star,
    title: 'Local Expertise',
    desc: "Our team knows Uganda's property market inside out — from Kololo to Entebbe, we know where value lives.",
  },
  {
    icon: TrendingUp,
    title: 'Transparent Pricing',
    desc: 'What you see is what you pay. No hidden fees, no bait-and-switch. Honest pricing, always.',
  },
]

const PROPERTY_TYPES = [
  { type: 'APARTMENT', label: 'Apartments', icon: Building2, desc: 'Modern flats & condos' },
  { type: 'HOUSE', label: 'Houses', icon: HomeIcon, desc: 'Family homes & villas' },
  { type: 'LAND', label: 'Land & Plots', icon: TreePine, desc: 'Development & investment land' },
  { type: 'COMMERCIAL', label: 'Commercial', icon: Store, desc: 'Offices, retail & warehouses' },
]

const LOCATIONS = [
  { name: 'Kampala', area: 'Central' },
  { name: 'Wakiso', area: 'Greater Kampala' },
  { name: 'Entebbe', area: 'Lakeside' },
  { name: 'Mukono', area: 'East' },
  { name: 'Jinja', area: 'Eastern Region' },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Nalubega',
    role: 'Homeowner · Kololo',
    text: 'Glomon Homes helped me find my dream apartment in just two weeks. The process was smooth and the team was incredibly helpful throughout.',
  },
  {
    name: 'David Musoke',
    role: 'Investor · UK Diaspora',
    text: "As someone investing from abroad, I needed a trustworthy partner. Glomon Homes gave me confidence with their verified listings and prompt communication.",
  },
  {
    name: 'Grace Atuhaire',
    role: 'Property Manager · Ntinda',
    text: 'I listed three properties through Glomon Homes and found tenants within a month for each. Highly recommended for landlords.',
  },
]

const SEARCH_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE']

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80'

export default function HomePage() {
  const navigate = useNavigate()
  const [searchLocation, setSearchLocation] = useState('')
  const [searchType, setSearchType] = useState('')
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO)
  const { data: featured, loading, error } = useFeaturedProperties()

  useEffect(() => {
    api.get('/api/settings')
      .then((res) => { if (res.data.hero_image) setHeroImage(res.data.hero_image) })
      .catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchLocation) params.set('district', searchLocation)
    if (searchType) params.set('type', searchType)
    navigate(`/listings${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen md:min-h-screen min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        {/* Navy overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(26,58,107,0.65)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-40">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 text-xs px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <MapPin size={11} className="text-accent" />
            Properties across Uganda
          </div>

          <h1 className="font-display text-5xl md:text-[56px] lg:text-[72px] font-bold text-white leading-[1.1] mb-5 tracking-tight">
            Find Your Place<br />
            <span className="text-accent">in Uganda</span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-md mx-auto mb-12 leading-relaxed">
            Verified listings across Kampala, Wakiso, Entebbe and beyond.
          </p>

          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-card shadow-2xl p-2.5 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
          >
            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1 px-4 py-3 text-sm text-text-main border border-border rounded-btn focus:outline-none focus:border-primary bg-white"
            >
              <option value="">Any location</option>
              {LOCATIONS.map((l) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>

            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="flex-1 px-4 py-3 text-sm text-text-main border border-border rounded-btn focus:outline-none focus:border-primary bg-white"
            >
              <option value="">Any type</option>
              {SEARCH_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-btn font-semibold text-sm transition-colors whitespace-nowrap"
            >
              <Search size={15} />
              Search
            </button>
          </form>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-white/50 text-sm">
            <span>200+ Listings</span>
            <span className="w-1 h-1 rounded-full bg-white/25" />
            <span>5 Districts</span>
            <span className="w-1 h-1 rounded-full bg-white/25" />
            <span>Trusted by buyers across Uganda</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs select-none">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── Featured Properties ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">
                Handpicked for you
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/listings?featured=true"
              className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:text-primary-light transition-colors"
            >
              View all <ChevronRight size={15} />
            </Link>
          </div>

          <PropertyGrid
            properties={featured}
            loading={loading}
            error={error}
            emptyMessage="No featured properties right now. Check back soon."
          />

          <div className="mt-8 text-center sm:hidden">
            <Link to="/listings" className="text-sm text-primary font-medium hover:underline">
              View all properties →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Glomon Homes ─────────────────────────────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">
              Why choose us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Why Glomon Homes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-14 h-14 bg-white/10 group-hover:bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Property Types ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">
              Browse by type
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main">
              What Are You Looking For?
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PROPERTY_TYPES.map(({ type, label, icon: Icon, desc }) => (
              <Link
                key={type}
                to={`/listings?type=${type}`}
                className="group p-7 bg-surface rounded-card shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-primary/5 group-hover:bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <Icon
                    size={22}
                    className="text-primary group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="font-display font-semibold text-text-main text-[15px] mb-1">
                  {label}
                </h3>
                <p className="text-xs text-text-muted">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Locations ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">
              We operate across
            </p>
            <h2 className="font-display text-3xl font-bold text-text-main">
              Locations We Cover
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {LOCATIONS.map(({ name, area }) => (
              <Link
                key={name}
                to={`/listings?district=${name}`}
                className="flex items-center gap-2 px-5 py-3 bg-bg border border-border rounded-full hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <MapPin size={13} className="text-accent" />
                <span className="font-medium text-sm text-text-main group-hover:text-primary transition-colors">
                  {name}
                </span>
                <span className="text-xs text-text-muted">· {area}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">
              What people say
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main">
              Trusted by Ugandans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text }) => (
              <div key={name} className="bg-surface rounded-card shadow-card p-6 flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-text-muted text-sm leading-relaxed flex-1 mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-main text-sm">{name}</p>
                    <p className="text-xs text-text-muted">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-accent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            List Your Property With Us
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Reach thousands of qualified buyers and renters across Uganda.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-amber-700 font-bold px-8 py-4 rounded-btn hover:bg-gray-50 transition-colors text-sm shadow-lg"
          >
            Get In Touch <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
