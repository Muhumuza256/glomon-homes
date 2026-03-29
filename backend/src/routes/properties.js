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

// Public
router.get('/', getProperties)
router.get('/featured', getFeaturedProperties)
router.get('/:id', getPropertyById)

// Admin (JWT required)
router.get('/admin/all', authMiddleware, adminGetAllProperties)
router.post('/', authMiddleware, createProperty)
router.put('/:id', authMiddleware, updateProperty)
router.delete('/:id', authMiddleware, deleteProperty)
router.patch('/:id/status', authMiddleware, updatePropertyStatus)

module.exports = router
