const express = require('express')
const router = express.Router()
const { getCities, getCity } = require('../controllers/cityController')
const { protectRoute } = require('../middleware/auth')

router.get('/cities', protectRoute, getCities)
router.get('/cities/:id', protectRoute, getCity)

module.exports = router
