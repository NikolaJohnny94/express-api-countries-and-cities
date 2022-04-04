const fs = require('fs')
const path = require('path')
const { parse } = require('fast-csv')
const cityModel = require('../models/City')
const countryModel = require('../models/Country')
const dotenv = require('dotenv').config({
  path: path.resolve(__dirname, '../', 'config', '.env'),
})
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)

let cityRowCounter = 0

const readCountryDataAndPopulateDB = () => {
  let countryNames = []
  let country = {
    name: '',
  }
  fs.createReadStream(path.resolve(__dirname, '../', 'data', 'worldcities.csv'))
    .pipe(parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      countryNames.push(row.country)
    })
    .on('end', (rowCount) => {
      console.log(`Parsed ${rowCount} rows`)
      let duplicatesRemoved = [...new Set(countryNames)]

      duplicatesRemoved.forEach(async (countryName, idx) => {
        country = {
          name: countryName,
        }
        console.log(country)
        await countryModel.create(country)
        if (duplicatesRemoved.length - 1 === idx) {
          process.exit()
        }
      })
    })
}

const readCityDataAndPopulateDB = () => {
  fs.createReadStream(path.resolve(__dirname, '../', 'data', 'worldcities.csv'))
    .pipe(parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', async (row) => {
      let currentCountry = await countryModel.findOne({ name: row.country })
      let city = {
        name: '',
        lat: null,
        lng: null,
        population: null,
        country: '',
        countryName: '',
      }
      city = {
        name: row.city,
        lat: row.lat,
        lng: row.lng,
        population: row.population,
        country: currentCountry,
        countryName: row.country,
      }
      console.log(city)
      await cityModel.create(city)
      cityRowCounter += 1
      if (cityRowCounter === 42905) {
        process.exit()
      }
    })

    .on('end', (rowCount) => {
      console.log(`Parsed ${rowCount} rows`)
    })
}

//Open, read and populate countries collection
if (process.argv[2] === '-importcountrydata') {
  readCountryDataAndPopulateDB()
}

//Open, read and populate cities collection
if (process.argv[2] === '-importcitydata') {
  readCityDataAndPopulateDB()
}
