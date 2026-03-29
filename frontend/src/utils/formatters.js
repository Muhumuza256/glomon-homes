/**
 * Format a price in UGX with comma separators.
 * e.g. 450000000 → "UGX 450,000,000"
 */
export function formatPrice(amount, currency = 'UGX') {
  if (amount == null) return '—'
  return `${currency} ${Number(amount).toLocaleString('en-UG')}`
}

/**
 * Format a date string to a readable format.
 * e.g. "2024-06-01T00:00:00.000Z" → "1 Jun 2024"
 */
export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-UG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns a fallback placeholder image URL if no cover image is set.
 */
export function getPropertyImage(url) {
  return url || 'https://placehold.co/800x600/1A3A6B/white?text=Glomon+Homes'
}

/**
 * Format USD equivalent of a UGX amount.
 * e.g. formatPriceWithUSD(450000000, 3700) → "≈ $121,622"
 * Returns null if rate is not available.
 */
export function formatPriceWithUSD(ugxAmount, rate) {
  if (!ugxAmount || !rate) return null
  const usd = Math.round(Number(ugxAmount) / rate)
  return `≈ $${usd.toLocaleString('en-US')}`
}
