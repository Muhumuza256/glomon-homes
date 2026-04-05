import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Home,
  ChevronLeft,
  Phone,
  MessageCircle,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PropertyImageGallery from '../components/properties/PropertyImageGallery'
import EnquiryForm from '../components/forms/EnquiryForm'
import VisitBookingModal from '../components/forms/VisitBookingModal'
import PropertyGrid from '../components/properties/PropertyGrid'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { useProperty, useProperties } from '../hooks/useProperties'
import { formatPrice, formatDate, formatPriceWithUSD } from '../utils/formatters'
import { useCurrency } from '../context/CurrencyContext'
import SEO from '../components/SEO'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'

const AMENITY_ICONS = {
  Parking: '🚗',
  Security: '🔒',
  'Swimming Pool': '🏊',
  Generator: '⚡',
  'Water Tank': '💧',
  Garden: '🌿',
  'WiFi Ready': '📶',
  'Lake View': '🌊',
  Gym: '🏋️',
  Lift: '🛗',
  CCTV: '📷',
  Borehole: '💦',
}

function StatBox({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={18} className="text-primary" />
      </div>
      <div>
        <p className="font-semibold text-text-main text-lg leading-none">{value}</p>
        <p className="text-xs text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const WA_NUMBER = '256704079274'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { data: property, loading, error } = useProperty(id)
  const { usdRate } = useCurrency()
  const [visitOpen, setVisitOpen] = useState(false)

  const { data: related } = useProperties(
    property ? { district: property.district, type: property.propertyType } : {},
    1
  )
  const relatedProperties = (related ?? []).filter((p) => p.id !== id).slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="text-6xl mb-5">🏚️</div>
          <h2 className="font-display text-2xl font-bold text-text-main mb-2">
            Property Not Found
          </h2>
          <p className="text-text-muted text-sm mb-7 max-w-xs">
            {error ?? 'This property may have been removed or is no longer available.'}
          </p>
          <Link
            to="/listings"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft size={15} />
            Back to Listings
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const {
    title,
    description,
    price,
    priceType,
    currency,
    location,
    district,
    address,
    bedrooms,
    bathrooms,
    area,
    propertyType,
    status,
    featured,
    amenities,
    images,
    coverImage,
    createdAt,
  } = property

  const seoTitle = `${title} in ${location || district}`
  const seoDescription = `${bedrooms ? bedrooms + '-bedroom ' : ''}${propertyType.charAt(0) + propertyType.slice(1).toLowerCase()} for ${priceType === 'SALE' ? 'sale' : 'rent'} in ${location || district}, Uganda. ${formatPrice(price, currency)}. Contact Glomon Homes today.`
  const seoImage = coverImage || DEFAULT_IMAGE

  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: description,
    url: `https://www.glomonhomes.online/listings/${id}`,
    image: seoImage,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: currency || 'UGX',
      availability: status === 'ACTIVE' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: district,
      streetAddress: address || location,
      addressCountry: 'UG',
    },
  }

  return (
    <div className="min-h-screen bg-bg">
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(listingSchema)}</script>
      </Helmet>
      <Navbar />

      <div className="pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-primary transition-colors">
              Listings
            </Link>
            <span>/</span>
            <span className="text-text-main truncate max-w-[200px]">{title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Left column ──────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Gallery */}
              <PropertyImageGallery images={images} coverImage={coverImage} title={title} />

              {/* Header */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    <Badge variant={priceType === 'SALE' ? 'sale' : 'rent'}>
                      For {priceType === 'SALE' ? 'Sale' : 'Rent'}
                    </Badge>
                    {featured && <Badge variant="featured">Featured</Badge>}
                    {status === 'SOLD' && <Badge variant="sold">Sold</Badge>}
                    {status === 'RENTED' && <Badge variant="rented">Rented</Badge>}
                    <Badge variant="default">
                      {propertyType.charAt(0) + propertyType.slice(1).toLowerCase()}
                    </Badge>
                  </div>

                  <h1 className="font-display text-2xl md:text-3xl font-bold text-text-main leading-tight mb-2.5">
                    {title}
                  </h1>

                  <div className="flex items-center gap-1.5 text-text-muted text-sm">
                    <MapPin size={13} className="text-accent shrink-0" />
                    <span>{[location, district, address].filter(Boolean).join(' · ')}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:text-right shrink-0">
                  <p className="font-display font-bold text-primary text-2xl md:text-3xl leading-none">
                    {formatPrice(price, currency)}
                  </p>
                  {formatPriceWithUSD(price, usdRate) && (
                    <p className="text-sm text-text-muted mt-0.5">
                      {formatPriceWithUSD(price, usdRate)}
                    </p>
                  )}
                  {priceType === 'RENT' && (
                    <p className="text-sm text-text-muted mt-1">per month</p>
                  )}
                  <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1 sm:justify-end">
                    <Calendar size={11} />
                    Listed {formatDate(createdAt)}
                  </p>
                </div>
              </div>

              {/* Key stats */}
              {(bedrooms || bathrooms || area) && (
                <div className="flex flex-wrap gap-6 bg-surface rounded-card shadow-card p-5 mt-6">
                  {bedrooms && (
                    <StatBox
                      icon={Bed}
                      value={bedrooms}
                      label={bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    />
                  )}
                  {bathrooms && (
                    <StatBox
                      icon={Bath}
                      value={bathrooms}
                      label={bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                    />
                  )}
                  {area && <StatBox icon={Maximize2} value={`${area} m²`} label="Floor Area" />}
                  <StatBox
                    icon={Home}
                    value={propertyType.charAt(0) + propertyType.slice(1).toLowerCase()}
                    label="Property Type"
                  />
                </div>
              )}

              {/* Description */}
              <div className="mt-8">
                <h2 className="font-display font-semibold text-text-main text-xl mb-3">
                  About This Property
                </h2>
                <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>

              {/* Amenities */}
              {amenities?.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display font-semibold text-text-main text-xl mb-4">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 bg-surface border border-border rounded-btn px-4 py-3 text-sm"
                      >
                        <span className="text-base leading-none">
                          {AMENITY_ICONS[amenity] ?? '✓'}
                        </span>
                        <span className="font-medium text-text-main">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="mt-8">
                <h2 className="font-display font-semibold text-text-main text-xl mb-3">
                  Location
                </h2>
                <div className="flex items-start gap-3 bg-surface border border-border rounded-card p-4">
                  <MapPin size={17} className="text-accent mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-text-main">{district}</p>
                    {location && <p className="text-text-muted mt-0.5">{location}</p>}
                    {address && <p className="text-text-muted mt-0.5">{address}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right sidebar ─────────────────────────────────────────── */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-4">
                {/* Enquiry card */}
                <div className="bg-surface rounded-card shadow-card p-5">
                  <h3 className="font-display font-semibold text-text-main text-lg mb-4">
                    Enquire About This Property
                  </h3>
                  <EnquiryForm propertyId={id} propertyTitle={title} />
                </div>

                {/* Book a Visit */}
                <button
                  onClick={() => setVisitOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-3 rounded-card font-semibold text-sm transition-colors shadow-card"
                >
                  <Calendar size={15} />
                  Book a Visit
                </button>

                {/* WhatsApp + Call card */}
                <div className="bg-primary rounded-card p-5 space-y-3">
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, I am interested in ${title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-btn font-semibold text-sm transition-colors w-full"
                  >
                    <MessageCircle size={15} />
                    WhatsApp Us
                  </a>
                  <a
                    href="tel:+256704079274"
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-btn font-medium text-sm transition-colors w-full"
                  >
                    <Phone size={15} />
                    +256 704 079274
                  </a>
                </div>

                {/* Back link */}
                <Link
                  to="/listings"
                  className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
                >
                  <ChevronLeft size={15} />
                  Back to all listings
                </Link>
              </div>
            </aside>
          </div>

          {/* ── Related properties ──────────────────────────────────────── */}
          {relatedProperties.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-text-main mb-6">
                More Properties in {district}
              </h2>
              <PropertyGrid properties={relatedProperties} loading={false} />
            </div>
          )}
        </div>
      </div>

      <Footer />

      {visitOpen && (
        <VisitBookingModal
          propertyId={id}
          propertyTitle={property?.title}
          onClose={() => setVisitOpen(false)}
        />
      )}
    </div>
  )
}
