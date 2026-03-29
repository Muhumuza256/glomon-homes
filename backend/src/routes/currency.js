const { Router } = require('express')
const { getRate } = require('../controllers/currencyController')

const router = Router()

router.get('/rate', getRate)

module.exports = router
