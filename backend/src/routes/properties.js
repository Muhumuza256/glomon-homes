const { Router } = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  adminGetAllProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
} = require('../controllers/propertiesController')

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/', getProperties)
router.get('/featured', getFeaturedProperties)

// ── Admin (JWT required) — must be defined BEFORE /:id ───────────────────────
// If these come after /:id, Express matches "admin" as the id param
router.get('/admin/all', authMiddleware, adminGetAllProperties)
router.post('/', authMiddleware, createProperty)
router.put('/:id', authMiddleware, updateProperty)
router.delete('/:id', authMiddleware, deleteProperty)
router.patch('/:id/status', authMiddleware, updatePropertyStatus)

// ── Public: single property — must come last ─────────────────────────────────
router.get('/:id', getPropertyById)

module.exports = router
