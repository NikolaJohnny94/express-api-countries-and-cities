const express = require('express')
const router = express.Router()
const {
  registerUser,
  login,
  getLoggedUser,
} = require('../controllers/userController')
const { protectRoute } = require('../middleware/auth')

router.post('/register-user', registerUser)
router.post('/login', login)
router.get('/logged-user', protectRoute, getLoggedUser)

module.exports = router
