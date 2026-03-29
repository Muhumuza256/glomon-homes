const { Router } = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { upload, uploadImage } = require('../controllers/uploadController')

const router = Router()

// POST /api/upload  — admin only, single image
router.post('/', authMiddleware, upload.single('image'), uploadImage)

module.exports = router
