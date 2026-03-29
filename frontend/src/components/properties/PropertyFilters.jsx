const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' },
  { value: 'OFFICE', label: 'Office' },
]

const DISTRICTS = ['Kampala', 'Wakiso', 'Mukono', 'Entebbe', 'Jinja']

const BEDROOM_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' },
]

const MIN_PRICES = [
  { value: '', label: 'No minimum' },
  { value: '50000000', label: 'UGX 50M' },
  { value: '100000000', label: 'UGX 100M' },
  { value: '200000000', label: 'UGX 200M' },
  { value: '500000000', label: 'UGX 500M' },
]

const MAX_PRICES = [
  { value: '', label: 'No maximum' },
  { value: '100000000', label: 'UGX 100M' },
  { value: '300000000', label: 'UGX 300M' },
  { value: '500000000', label: 'UGX 500M' },
  { value: '1000000000', label: 'UGX 1B' },
]

function Section({ label, children }) {
  return (
    <div className="border-b border-border pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <h4 className="text-xs font-semibold text-text-main uppercase tracking-widest mb-3">{label}</h4>
      {children}
    </div>
  )
}

export default function PropertyFilters({ filters = {}, onChange }) {
  const toggle = (key, value) =>
    onChange({ ...filters, [key]: filters[key] === value ? '' : value })

  return (
    <div className="bg-surface rounded-card shadow-card p-5">
      <h3 className="font-display font-semibold text-text-main text-base mb-5">Filter Properties</h3>

      {/* Listing type */}
      <Section label="Listing Type">
        <div className="grid grid-cols-2 gap-2">
          {['SALE', 'RENT'].map((type) => (
            <button
              key={type}
              onClick={() => toggle('priceType', type)}
              className={`py-2 text-sm rounded-btn border font-medium transition-all ${
                filters.priceType === type
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              For {type === 'SALE' ? 'Sale' : 'Rent'}
            </button>
          ))}
        </div>
      </Section>

      {/* Property type */}
      <Section label="Property Type">
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggle('type', value)}
              className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${
                filters.type === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-text-muted hover:border-primary/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* District */}
      <Section label="District">
        <div className="space-y-2">
          {DISTRICTS.map((d) => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="district"
                checked={filters.district === d}
                onChange={() => toggle('district', d)}
                className="w-4 h-4 accent-[#1B4332]"
              />
              <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">
                {d}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Bedrooms */}
      <Section label="Bedrooms">
        <div className="flex gap-1.5">
          {BEDROOM_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggle('bedrooms', value)}
              className={`flex-1 py-2 text-xs rounded-btn border font-medium transition-all ${
                filters.bedrooms === value
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Price range */}
      <Section label="Price Range (UGX)">
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-text-muted mb-1.5 block">Minimum</label>
            <select
              value={filters.minPrice ?? ''}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full border border-border rounded-btn px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary bg-white"
            >
              {MIN_PRICES.map(({ value, label }) => (
                <option key={label} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-text-muted mb-1.5 block">Maximum</label>
            <select
              value={filters.maxPrice ?? ''}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full border border-border rounded-btn px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary bg-white"
            >
              {MAX_PRICES.map(({ value, label }) => (
                <option key={label} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <button
        onClick={() => onChange({})}
        className="w-full text-xs text-text-muted hover:text-primary transition-colors pt-1"
      >
        Clear all filters
      </button>
    </div>
  )
}
