const { Prisma } = require('@prisma/client')

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production'

  // Prisma: record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found.' })
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'A record with that value already exists.' })
    }
    console.error('[Prisma]', err.code, err.message)
    return res.status(500).json({ error: isDev ? err.message : 'Database error.' })
  }

  // Prisma: validation / connection issues
  if (
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    console.error('[Prisma]', err.message)
    return res.status(500).json({ error: isDev ? err.message : 'Database error.' })
  }

  // HTTP errors with an explicit status set by a controller
  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }

  // Unexpected errors
  console.error('[Server]', err)
  res.status(500).json({ error: isDev ? err.message : 'An unexpected error occurred.' })
}
