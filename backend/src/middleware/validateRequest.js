// Middleware factory: validates req.body against a Zod schema
module.exports = function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message })
    }
    req.body = result.data
    next()
  }
}
