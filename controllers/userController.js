const asyncHandler = require('express-async-handler')
const userModel = require('../models/User')
const Response = require('../utils/Response')
const asignTokenAndSendResponse = require('../utils/asignTokenAndSendResponse')

module.exports.registerUser = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body
  const user = await userModel.create({
    firstname,
    lastname,
    email,
    password,
  })
  asignTokenAndSendResponse(200, user, 'User successfully created!', res)
})

module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email) {
    res.status(400).send(new Response(false, 'Email required'))
  }

  if (!password) {
    res.status(400).send(new Response(false, 'Password required'))
  }

  const user = await userModel.findOne({ email }).select('+password')

  if (!user) {
    res.status(401).send(new Response(false, 'User not found'))
  } else {
    const passwordMatch = await user.checkPassword(password)
    if (!passwordMatch) {
      res
        .status(401)
        .send(
          new Response(false, "Invalid credentials: [Password doesn't match]")
        )
    } else {
      asignTokenAndSendResponse(200, user, 'Credentials are valid', res)
    }
  }
})

module.exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .send(new Response(true, 'User authenticated successfully!', req.user))
})
