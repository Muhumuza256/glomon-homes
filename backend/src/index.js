require('dotenv').config()
const express = require('express')
const cors = require('cors')

const propertiesRouter = require('./routes/properties')
const enquiriesRouter = require('./routes/enquiries')
const authRouter = require('./routes/auth')
const currencyRouter = require('./routes/currency')
const uploadRouter = require('./routes/upload')
const settingsRouter = require('./routes/settings')
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

// Routes
app.use('/api/properties', propertiesRouter)
app.use('/api/enquiries', enquiriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/currency', currencyRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/settings', settingsRouter)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Global error handler
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Glomon Homes API running on port ${PORT}`)
})
