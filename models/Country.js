const mongoose = require('mongoose')

const countrySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    collection: 'countries',
  }
)

countrySchema.virtual('cities', {
  ref: 'city',
  localField: '_id',
  foreignField: 'country',
  justOne: false,
})

const countryModel = mongoose.model('country', countrySchema)

module.exports = countryModel
