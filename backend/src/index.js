require('dotenv').config()
const express = require('express')
const cors = require('cors')

const propertiesRouter = require('./routes/properties')
const enquiriesRouter = require('./routes/enquiries')
const authRouter = require('./routes/auth')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

app.use(express.json())

// Routes
app.use('/api/properties', propertiesRouter)
app.use('/api/enquiries', enquiriesRouter)
app.use('/api/auth', authRouter)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Global error handler
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Glomon Homes API running on port ${PORT}`)
})
