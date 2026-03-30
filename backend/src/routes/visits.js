const { Router } = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { createVisit, getVisits, updateVisitStatus } = require('../controllers/visitsController')

const router = Router()

router.post('/', createVisit)                                         // public
router.get('/', authMiddleware, getVisits)                            // admin
router.patch('/:id/status', authMiddleware, updateVisitStatus)        // admin

module.exports = router
