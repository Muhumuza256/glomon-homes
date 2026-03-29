const { Router } = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getSettings, updateSetting } = require('../controllers/settingsController')

const router = Router()

router.get('/', getSettings)                                    // public
router.put('/:key', authMiddleware, updateSetting)              // admin only

module.exports = router
