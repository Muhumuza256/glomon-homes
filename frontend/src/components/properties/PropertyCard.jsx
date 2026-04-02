import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize2, MapPin, MessageCircle } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatPrice, getPropertyImage, formatPriceWithUSD } from '../../utils/formatters'
import { useCurrency } from '../../context/CurrencyContext'

const WA_NUMBER = '256704079274'

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    price,
    priceType,
    currency,
    location,
    district,
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
      aria-label={`View ${title} - ${propertyType} for ${priceType === 'SALE' ? 'sale' : 'rent'} in ${location}`}
      className="group block bg-surface rounded-[4px] overflow-hidden border border-border hover:border-[#1A1A1A]/30 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#F0F0EE]">
        <img
          src={getPropertyImage(coverImage)}
          alt={`${bedrooms ? bedrooms + '-bedroom ' : ''}${propertyType.charAt(0) + propertyType.slice(1).toLowerCase()} for ${priceType === 'SALE' ? 'sale' : 'rent'} in ${location}, Uganda`}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={priceType === 'SALE' ? 'sale' : 'rent'}>
            For {priceType === 'SALE' ? 'Sale' : 'Rent'}
          </Badge>
          {featured && <Badge variant="featured">Featured</Badge>}
        </div>

        {/* WhatsApp pill */}
        {!isClosed && (
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-sm transition-colors"
            aria-label="WhatsApp enquiry"
          >
            <MessageCircle size={12} />
            WhatsApp
          </a>
        )}

        {/* Sold / Rented overlay */}
        {isClosed && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className={`font-bold px-5 py-1.5 text-sm tracking-[0.15em] text-white uppercase ${
              status === 'SOLD' ? 'bg-red-600' : 'bg-blue-600'
            } rounded-full`}>
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 pt-3.5">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.18em] mb-1.5">
          {propertyType.charAt(0) + propertyType.slice(1).toLowerCase()}
          {district ? ` · ${district}` : ''}
        </p>

        <h3 className="font-display font-semibold text-text-main text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-text-muted mb-3.5">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate text-[12px]">{location}</span>
        </div>

        {/* Stats row */}
        {(bedrooms || bathrooms || area) && (
          <div className="flex items-center gap-4 text-[12px] text-text-muted pt-3 mb-3.5 border-t border-border">
            {bedrooms && (
              <span className="flex items-center gap-1">
                <Bed size={12} />
                {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1">
                <Bath size={12} />
                {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1">
                <Maximize2 size={12} />
                {area} m²
              </span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display font-bold text-[#1A1A1A] text-[18px] leading-none">
              {formatPrice(price, currency)}
            </p>
            {usdLabel && (
              <p className="text-[11px] text-text-muted mt-0.5">{usdLabel}</p>
            )}
            {priceType === 'RENT' && (
              <p className="text-[11px] text-text-muted mt-0.5">/ month</p>
            )}
          </div>
          <span className="text-[11px] font-semibold text-text-muted group-hover:text-accent group-hover:underline transition-colors">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}
