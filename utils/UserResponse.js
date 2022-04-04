class UserResponse {
  constructor(success, message, data, token) {
    this.success = success
    this.message = message
    this.data = data
    this.token = token
  }
}

module.exports = UserResponse
