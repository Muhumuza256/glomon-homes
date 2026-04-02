require('dotenv').config()
const express = require('express')
const cors = require('cors')
const prisma = require('./lib/prisma')

const propertiesRouter = require('./routes/properties')
const enquiriesRouter = require('./routes/enquiries')
const authRouter = require('./routes/auth')
const currencyRouter = require('./routes/currency')
const uploadRouter = require('./routes/upload')
const settingsRouter = require('./routes/settings')
const visitsRouter = require('./routes/visits')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true)
    // Allow any Vercel preview/production URL for this project
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use(express.json())

// Sitemap (no auth required)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, updatedAt: true },
    })
    const BASE = 'https://glomonhomes.com'
    const staticPages = [
      { loc: `${BASE}/`, changefreq: 'weekly', priority: '1.0' },
      { loc: `${BASE}/listings`, changefreq: 'daily', priority: '0.8' },
      { loc: `${BASE}/about`, changefreq: 'monthly', priority: '0.5' },
      { loc: `${BASE}/contact`, changefreq: 'monthly', priority: '0.5' },
    ]
    const propertyUrls = properties.map((p) => ({
      loc: `${BASE}/listings/${p.id}`,
      lastmod: p.updatedAt.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.6',
    }))
    const allUrls = [...staticPages, ...propertyUrls]
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    res.set('Content-Type', 'application/xml')
    res.send(xml)
  } catch (err) {
    res.status(500).send('Error generating sitemap')
  }
})

// Routes
app.use('/api/properties', propertiesRouter)
app.use('/api/enquiries', enquiriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/currency', currencyRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/visits', visitsRouter)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Global error handler
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Glomon Homes API running on port ${PORT}`)
})
