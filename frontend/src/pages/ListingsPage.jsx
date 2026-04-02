import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PropertyGrid from '../components/properties/PropertyGrid'
import PropertyFilters from '../components/properties/PropertyFilters'
import { useProperties } from '../hooks/useProperties'
import SEO from '../components/SEO'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

function buildFiltersFromParams(params) {
  return {
    type: params.get('type') ?? '',
    priceType: params.get('priceType') ?? '',
    district: params.get('district') ?? '',
    bedrooms: params.get('bedrooms') ?? '',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    featured: params.get('featured') ?? '',
  }
}

export default function ListingsPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => buildFiltersFromParams(searchParams))
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Sync URL params into filters on first render only
  useEffect(() => {
    setFilters(buildFiltersFromParams(searchParams))
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  const { data: properties, total, totalPages, loading, error } = useProperties(
    { ...filters, sort },
    page
  )

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const activeCount = Object.values(filters).filter(Boolean).length

  const FILTER_LABELS = {
    type: 'Type',
    priceType: 'Listing',
    district: 'District',
    bedrooms: 'Beds',
    minPrice: 'Min price',
    maxPrice: 'Max price',
    featured: 'Featured',
  }

  return (
    <div className="min-h-screen bg-bg">
      <SEO
        title="Property Listings in Uganda | Houses, Apartments & Land — Glomon Homes"
        description="Browse verified property listings across Uganda. Filter by location, price, and type. Apartments, houses and land for sale or rent in Kampala and beyond."
      />
      <Navbar />

      {/* Page header */}
      <div className="bg-primary pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
            Properties for Sale &amp; Rent in Uganda
          </h1>
          <p className="text-white/65 text-sm">
            Browse our verified listings of houses, apartments, and land for sale or rent across Kampala, Wakiso, Entebbe, Mukono and the greater Uganda region.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar – desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <PropertyFilters filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-btn text-sm font-medium text-text-main shadow-sm hover:border-primary transition-colors"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {activeCount}
                    </span>
                  )}
                </button>

                <p className="text-sm text-text-muted">
                  {loading ? (
                    'Loading…'
                  ) : (
                    <>
                      <span className="font-semibold text-text-main">{total}</span>{' '}
                      {total === 1 ? 'property' : 'properties'} found
                    </>
                  )}
                </p>
              </div>

              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1) }}
                className="border border-border rounded-btn px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Active filter pills */}
            {activeCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {Object.entries(filters).map(([key, val]) =>
                  val ? (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {FILTER_LABELS[key]}: {val}
                      <button
                        onClick={() => handleFilterChange({ ...filters, [key]: '' })}
                        className="hover:text-primary-light transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ) : null
                )}
                <button
                  onClick={() => handleFilterChange({})}
                  className="text-xs text-text-muted hover:text-primary transition-colors ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              emptyMessage="Try adjusting your filters — there may be properties in nearby areas."
            />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-btn border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-btn border text-sm font-medium transition-colors ${
                      p === page
                        ? 'border-primary bg-primary text-white'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-btn border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative ml-auto w-80 max-w-[90vw] h-full bg-bg overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-bg border-b border-border px-5 py-4 flex items-center justify-between">
              <h3 className="font-display font-semibold text-text-main">Filters</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-text-muted hover:text-text-main transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <PropertyFilters
                filters={filters}
                onChange={(f) => {
                  handleFilterChange(f)
                  setDrawerOpen(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
