import PropertyCard from './PropertyCard'

function SkeletonCard() {
  return (
    <div className="bg-surface rounded-card shadow-card overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-4 pt-3 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-14" />
          <div className="h-3 bg-gray-200 rounded w-14" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-6 bg-gray-200 rounded-full w-14" />
        </div>
      </div>
    </div>
  )
}

export default function PropertyGrid({
  properties,
  loading,
  error,
  emptyMessage = 'No properties found.',
  skeletonCount = 6,
}) {
  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-muted text-sm">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!properties?.length) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🏠</span>
        </div>
        <h3 className="font-display font-semibold text-text-main text-lg mb-1">No Properties Found</h3>
        <p className="text-text-muted text-sm max-w-xs mx-auto">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}
