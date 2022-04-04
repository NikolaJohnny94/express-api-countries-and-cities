const mongoose = require('mongoose')

const citySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    population: {
      type: Number,
    },
    country: {
      type: mongoose.Schema.ObjectId,
      ref: 'country',
      required: true,
    },
    countryName: {
      type: String,
    },
  },
  {
    collection: 'cities',
  }
)

const cityModel = mongoose.model('city', citySchema)

module.exports = cityModel
