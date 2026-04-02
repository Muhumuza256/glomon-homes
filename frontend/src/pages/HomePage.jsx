import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'
import {
  Search, Shield, Star, TrendingUp, Building2,
  Home as HomeIcon, TreePine, Store, ChevronRight,
  MapPin, ChevronDown, ChevronUp, Send, CheckCircle,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PropertyGrid from '../components/properties/PropertyGrid'
import Spinner from '../components/ui/Spinner'
import { useFeaturedProperties } from '../hooks/useProperties'
import SEO from '../components/SEO'

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Glomon Homes',
  url: 'https://glomonhomes.com',
  description: "Uganda's trusted real estate company for buying, renting and investing in verified property across Kampala, Wakiso, Entebbe and beyond.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot 45, Kira Road',
    addressLocality: 'Kampala',
    addressCountry: 'UG',
  },
  telephone: '+256704079274',
  sameAs: [
    'https://www.instagram.com/glomon_homes_co._ltd',
    'https://www.tiktok.com/@glomon_homes_co_ltd',
  ],
}

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

const FAQS = [
  {
    q: 'Can foreigners buy property in Uganda?',
    a: 'Yes. Foreigners can legally purchase property in Uganda, typically on leasehold tenure (up to 99 years). Mailo and freehold land is reserved for Ugandan citizens, but lease agreements offer the same practical security for investors and residents.',
  },
  {
    q: 'What documents do I need to buy property?',
    a: 'Key documents include: the land title (verify with the Ministry of Lands), a sale agreement, proof of identity (passport or national ID), and a consent letter if applicable. We strongly advise using a registered advocate to conduct due diligence before any purchase.',
  },
  {
    q: 'How long does a property transaction take?',
    a: 'A straightforward sale typically takes 4–8 weeks from signing the sale agreement to title transfer, depending on the land registry workload and whether the title is clean. More complex transactions or disputes can extend this timeline.',
  },
  {
    q: 'What is Mailo Land?',
    a: 'Mailo land is a form of tenure unique to Uganda, originating from the 1900 Buganda Agreement. It is privately owned and can be sold, leased, or inherited. It differs from freehold (full private ownership), leasehold (time-limited), and customary land tenure.',
  },
  {
    q: 'What additional costs should I budget for?',
    a: 'Beyond the purchase price, budget for: stamp duty (1.5% of value), registration fees (~1%), advocate fees (1–2%), valuation fees, and agency commission if applicable. Total transaction costs typically run 3–5% of the property value.',
  },
  {
    q: 'Do you offer property management services?',
    a: 'Yes. We offer property management for landlords including tenant screening, rent collection, maintenance coordination, and regular inspections. Contact us for a tailored management package.',
  },
]

const SEARCH_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE']
const DEFAULT_HERO = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80'

// ── FAQ Accordion item ────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-[6px] overflow-hidden transition-colors ${open ? 'border-[#1A1A1A]/30' : 'border-border'}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-surface hover:bg-[#1A1A1A]/3 transition-colors"
      >
        <span className="font-medium text-text-main text-[14px] pr-6">{q}</span>
        {open ? (
          <ChevronUp size={15} className="text-[#1A1A1A] shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-text-muted shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 bg-surface border-t border-border">
          <p className="text-text-muted text-[13px] leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [searchLocation, setSearchLocation] = useState('')
  const [searchType, setSearchType] = useState('')
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO)
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideImages, setSlideImages] = useState([])
  const pauseRef = useRef(false)

  // Quick question form
  const [qForm, setQForm] = useState({ name: '', email: '', message: '' })
  const [qLoading, setQLoading] = useState(false)
  const [qSuccess, setQSuccess] = useState(false)
  const [qError, setQError] = useState('')

  const { data: featured, loading, error } = useFeaturedProperties()

  // Load admin-configured hero & settings
  useEffect(() => {
    api.get('/api/settings')
      .then((res) => { if (res.data.hero_image) setHeroImage(res.data.hero_image) })
      .catch(() => {})
  }, [])

  // Build slideshow from featured property images
  useEffect(() => {
    if (!featured?.length) return
    const imgs = featured
      .filter((p) => p.coverImage)
      .map((p) => ({ url: p.coverImage, title: p.title, location: p.location }))
    if (imgs.length > 1) setSlideImages(imgs)
  }, [featured])

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (slideImages.length <= 1) return
    const timer = setInterval(() => {
      if (!pauseRef.current) {
        setSlideIndex((i) => (i + 1) % slideImages.length)
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [slideImages.length])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchLocation) params.set('district', searchLocation)
    if (searchType) params.set('type', searchType)
    navigate(`/listings${params.toString() ? '?' + params.toString() : ''}`)
  }

  const handleQuestion = async (e) => {
    e.preventDefault()
    setQError('')
    setQLoading(true)
    try {
      await api.post('/api/enquiries', { ...qForm, propertyId: null })
      setQSuccess(true)
    } catch {
      setQError('Could not send your question. Please try again.')
    } finally {
      setQLoading(false)
    }
  }

  const currentSlide = slideImages[slideIndex]
  const activeBg = currentSlide?.url ?? heroImage

  return (
    <div className="min-h-screen bg-bg">
      <SEO
        title="Glomon Homes | Buy, Rent & Invest in Uganda Real Estate"
        description="Find verified houses, apartments and land for sale or rent in Kampala, Wakiso, Entebbe and across Uganda. Glomon Homes — Find Your Place in Uganda."
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(ORG_SCHEMA)}</script>
      </Helmet>
      <Navbar />

      {/* ── Hero with auto-slideshow ──────────────────────────────────────── */}
      <section
        aria-label="Hero — Find property in Uganda"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        onMouseEnter={() => { pauseRef.current = true }}
        onMouseLeave={() => { pauseRef.current = false }}
      >
        {/* Slide layers — all rendered, only current is visible */}
        {slideImages.length > 1 ? (
          slideImages.map((img, i) => (
            <div
              key={img.url}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
              style={{ backgroundImage: `url(${img.url})`, opacity: i === slideIndex ? 1 : 0 }}
            />
          ))
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${activeBg})` }}
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,10,10,0.68)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-40">
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
          <form onSubmit={handleSearch} className="bg-surface rounded-card shadow-2xl p-2.5 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1 px-4 py-3 text-sm text-text-main border border-border rounded-btn focus:outline-none focus:border-primary bg-surface"
            >
              <option value="">Any location</option>
              {LOCATIONS.map((l) => (<option key={l.name} value={l.name}>{l.name}</option>))}
            </select>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="flex-1 px-4 py-3 text-sm text-text-main border border-border rounded-btn focus:outline-none focus:border-primary bg-surface"
            >
              <option value="">Any type</option>
              {SEARCH_TYPES.map((t) => (<option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>))}
            </select>
            <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-accent text-white rounded-btn font-semibold text-sm transition-colors whitespace-nowrap">
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

        {/* Slideshow dots */}
        {slideImages.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {slideImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === slideIndex ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Property name caption */}
        {currentSlide && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-white/60 text-xs">{currentSlide.title} · {currentSlide.location}</p>
          </div>
        )}

        {/* Scroll indicator */}
        {!currentSlide && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs select-none">
            <span>Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        )}
      </section>

      {/* ── Featured Properties ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">Handpicked for you</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main">Featured Properties in Uganda</h2>
            </div>
            <Link to="/listings?featured=true" className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:text-primary-light transition-colors">
              View all <ChevronRight size={15} />
            </Link>
          </div>
          <PropertyGrid properties={featured} loading={loading} error={error} emptyMessage="No featured properties right now. Check back soon." />
          <div className="mt-8 text-center sm:hidden">
            <Link to="/listings" className="text-sm text-primary font-medium hover:underline">View all properties →</Link>
          </div>
        </div>
      </section>

      {/* ── Why Glomon Homes ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">Why choose us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Why Glomon Homes</h2>
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
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">Browse by type</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main">What Are You Looking For?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PROPERTY_TYPES.map(({ type, label, icon: Icon, desc }) => (
              <Link key={type} to={`/listings?type=${type}`}
                className="group p-7 bg-surface rounded-card shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-[#1A1A1A]/5 group-hover:bg-[#1A1A1A] rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <Icon size={22} className="text-[#1A1A1A] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-semibold text-text-main text-[15px] mb-1">{label}</h3>
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
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">We operate across</p>
            <h2 className="font-display text-3xl font-bold text-text-main">Properties Across Uganda</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {LOCATIONS.map(({ name, area }) => (
              <Link key={name} to={`/listings?district=${name}`}
                className="flex items-center gap-2 px-5 py-3 bg-bg border border-border rounded-full hover:border-[#1A1A1A] hover:bg-[#1A1A1A] transition-all group"
              >
                <MapPin size={13} className="text-accent group-hover:text-white" />
                <span className="font-medium text-sm text-text-main group-hover:text-white transition-colors">{name}</span>
                <span className="text-xs text-text-muted group-hover:text-white/70 transition-colors">· {area}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-2">What people say</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main">Trusted by Ugandans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text }) => (
              <div key={name} className="bg-surface rounded-card shadow-card p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={13} className="text-accent fill-accent" />))}
                </div>
                <p className="text-text-muted text-sm leading-relaxed flex-1 mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">{name[0]}</span>
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

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-3">
              Got questions?
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-main mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-text-muted text-sm">
              Everything you need to know about buying, renting, and investing in Ugandan property.
            </p>
          </div>

          <div className="space-y-3 mb-14">
            {FAQS.map((faq) => (<FaqItem key={faq.q} {...faq} />))}
          </div>

          {/* Ask a question */}
          <div className="bg-bg border border-border rounded-card p-6 sm:p-8">
            {qSuccess ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <h4 className="font-display font-semibold text-text-main text-lg mb-1">Question received!</h4>
                <p className="text-text-muted text-sm">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display font-semibold text-text-main text-xl mb-1">
                  Still have a question?
                </h3>
                <p className="text-text-muted text-sm mb-5">
                  Ask us anything about properties or real estate in Uganda — we're happy to help.
                </p>
                {qError && <p className="text-xs text-red-600 mb-3">{qError}</p>}
                <form onSubmit={handleQuestion} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text" required placeholder="Your name"
                      value={qForm.name}
                      onChange={(e) => setQForm((f) => ({ ...f, name: e.target.value }))}
                      className="border border-border rounded-btn px-3 py-2.5 text-sm text-text-main bg-surface focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="email" required placeholder="your@email.com"
                      value={qForm.email}
                      onChange={(e) => setQForm((f) => ({ ...f, email: e.target.value }))}
                      className="border border-border rounded-btn px-3 py-2.5 text-sm text-text-main bg-surface focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <textarea
                    required rows={3} placeholder="What would you like to know?"
                    value={qForm.message}
                    onChange={(e) => setQForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full border border-border rounded-btn px-3 py-2.5 text-sm text-text-main bg-surface focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <button
                    type="submit" disabled={qLoading}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {qLoading ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <Send size={14} />}
                    {qLoading ? 'Sending…' : 'Send Question'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-[#1A1A1A]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-semibold text-xs uppercase tracking-[0.18em] mb-4">
            List with us
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            List Your Property With Glomon Homes
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Reach thousands of qualified buyers and renters across Uganda.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-bold px-8 py-4 rounded-btn hover:bg-accent hover:text-white transition-colors text-sm"
          >
            Get In Touch <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
