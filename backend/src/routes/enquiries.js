const { Router } = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const {
  submitEnquiry,
  submitGeneralEnquiry,
  adminGetEnquiries,
  updateEnquiryStatus,
} = require('../controllers/enquiriesController')

const router = Router()

// Public
router.post('/', submitEnquiry)
router.post('/general', submitGeneralEnquiry)

// Admin (JWT required)
router.get('/', authMiddleware, adminGetEnquiries)
router.patch('/:id/status', authMiddleware, updateEnquiryStatus)

module.exports = router
