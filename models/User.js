const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const slugify = require('slugify')

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Firstname is required'],
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Add valid email format',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  slug: {
    type: String,
    unique: [true, ['Slug must be unique']],
  },
})

userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.pre('save', function () {
  this.slug = slugify(
    `${this.firstname} ${this.lastname} ${Math.random()
      .toString(16)
      .substring(2, 16)}`,
    { lower: true }
  )
})

userSchema.methods.asignToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

userSchema.methods.checkPassword = async function (typedPassword) {
  return await bcrypt.compare(typedPassword, this.password)
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
