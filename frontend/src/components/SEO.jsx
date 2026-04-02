import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://glomonhomes.com'
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'
const DEFAULT_DESCRIPTION = 'Find verified houses, apartments and land for sale or rent in Kampala, Wakiso, Entebbe and across Uganda. Glomon Homes — Find Your Place in Uganda.'

export default function SEO({
  title = 'Glomon Homes | Buy, Rent & Invest in Uganda Real Estate',
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
}) {
  const { pathname } = useLocation()
  const canonical = `${SITE_URL}${pathname}`
  const fullTitle = title.includes('Glomon Homes') ? title : `${title} | Glomon Homes`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Glomon Homes" />
      <meta property="og:locale" content="en_UG" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@glomonhomes" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
