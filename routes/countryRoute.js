const express = require('express')
const router = express.Router()
const {
  getCountries,
  getCountryCities,
  getNearestAndFarthestCities,
} = require('../controllers/countryController')
const { protectRoute } = require('../middleware/auth')

router.get('/countries', protectRoute, getCountries)
router.get('/countries/country-cities', protectRoute, getCountryCities)
router.get(
  '/countries/nearest-and-farthest-cities/:id',
  protectRoute,
  getNearestAndFarthestCities
)

module.exports = router
