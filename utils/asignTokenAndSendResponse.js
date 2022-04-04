const UserResponse = require('./UserResponse')

const asignTokenAndSendResponse = (statusCode, user, message, res) => {
  const token = user.asignToken()
  res.status(statusCode).json(new UserResponse(true, message, user, token))
}

module.exports = asignTokenAndSendResponse
