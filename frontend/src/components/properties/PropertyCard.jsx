import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize2, MapPin, MessageCircle } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatPrice, getPropertyImage, formatPriceWithUSD } from '../../utils/formatters'
import { useCurrency } from '../../context/CurrencyContext'

const WA_NUMBER = '256700000000'

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    price,
    priceType,
    currency,
    location,
    bedrooms,
    bathrooms,
    area,
    coverImage,
    propertyType,
    featured,
    status,
  } = property

  const { usdRate } = useCurrency()
  const usdLabel = formatPriceWithUSD(price, usdRate)
  const isClosed = status === 'SOLD' || status === 'RENTED'
  const waText = encodeURIComponent(`Hi, I am interested in ${title}`)

  return (
    <Link
      to={`/listings/${id}`}
      className="group block bg-surface rounded-card shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={getPropertyImage(coverImage)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={priceType === 'SALE' ? 'sale' : 'rent'}>
            For {priceType === 'SALE' ? 'Sale' : 'Rent'}
          </Badge>
          {featured && <Badge variant="featured">Featured</Badge>}
        </div>

        {/* WhatsApp button — bottom-right */}
        {!isClosed && (
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow transition-colors"
            aria-label="WhatsApp enquiry"
          >
            <MessageCircle size={13} />
            WhatsApp
          </a>
        )}

        {/* Sold / Rented overlay */}
        {isClosed && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <span
              className={`font-bold px-4 py-1.5 rounded-full text-sm tracking-widest text-white ${
                status === 'SOLD' ? 'bg-red-600' : 'bg-blue-600'
              }`}
            >
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-1">
          {propertyType.charAt(0) + propertyType.slice(1).toLowerCase()}
        </p>

        <h3 className="font-display font-semibold text-text-main text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-text-muted text-sm mb-3">
          <MapPin size={12} className="shrink-0 text-accent" />
          <span className="truncate text-[13px]">{location}</span>
        </div>

        {/* Stat row */}
        {(bedrooms || bathrooms || area) && (
          <div className="flex items-center gap-4 text-text-muted text-[13px] pt-3 mb-3 border-t border-border">
            {bedrooms && (
              <span className="flex items-center gap-1.5">
                <Bed size={13} className="text-primary/50" />
                {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1.5">
                <Bath size={13} className="text-primary/50" />
                {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1.5">
                <Maximize2 size={13} className="text-primary/50" />
                {area} m²
              </span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display font-bold text-primary text-[17px] leading-none">
              {formatPrice(price, currency)}
            </p>
            {usdLabel && (
              <p className="text-[11px] text-text-muted mt-0.5">{usdLabel}</p>
            )}
            {priceType === 'RENT' && (
              <p className="text-[11px] text-text-muted mt-0.5">per month</p>
            )}
          </div>
          <span className="text-[11px] font-semibold text-primary bg-primary/5 group-hover:bg-primary group-hover:text-white px-3 py-1.5 rounded-full transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
