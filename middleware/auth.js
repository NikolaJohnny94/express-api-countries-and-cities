const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const Response = require('../utils/Response')
const userModel = require('../models/User')

module.exports.protectRoute = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    res
      .status(401)
      .json(new Response(false, 'User not authorized to access this route'))
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await userModel.findById(decodedToken.id)
    next()
  } catch (e) {
    res
      .status(401)
      .json(new Response(false, 'User not authorized to access this route'))
  }
})
