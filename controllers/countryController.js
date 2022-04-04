const asyncHandler = require('express-async-handler')
const countryModel = require('../models/Country')
const cityModel = require('../models/City')
const Response = require('../utils/Response')

//Get all Countries | Country by Name | Country by ID
module.exports.getCountries = asyncHandler(async (req, res, next) => {
  try {
    //Search by country name
    if (req.query.name) {
      const countryByName = await countryModel.findOne({ name: req.query.name })
      if (countryByName) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with name '${req.query.name}' successfully retrieved from the database!`,
              countryByName
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with name '${req.query.name}' not found in the database!`
            )
          )
      }
    } else if (req.query.id) {
      //Search by country id
      const countryById = await countryModel.findById(req.query.id)
      if (countryById) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with id '${req.query.id}' successfully retrieved from the database!`,
              countryById
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with id: '${req.query.id}' not found in the database!`
            )
          )
      }
    } else {
      if (Object.keys(req.query).length === 0) {
        //If req.query doesn't exist retrieve all countries
        const countries = await countryModel.find()
        res
          .status(200)
          .json(
            new Response(
              true,
              'Data retrieved from database successfully',
              countries
            )
          )
      } else {
        res
          .status(400)
          .json(
            new Response(
              false,
              'Retrieving countries from the database ended unsuccessfully!'
            )
          )
      }
    }
  } catch (e) {
    console.log(e)
    res
      .status(400)
      .json(
        new Response(
          false,
          'Problem occured while trying to retrieve countries from the database!',
          e.message
        )
      )
  }
})

//Populate selected countries with cities virtuals
module.exports.getCountryCities = asyncHandler(async (req, res, next) => {
  try {
    //Find country by id and filter cities for passed 'city' query
    if (req.query.id && req.query.city) {
      const countryById = await countryModel
        .findById(req.query.id)
        .populate('cities')
      if (countryById) {
        let filteredData = countryById.cities.filter(
          (city) => city.name.toLowerCase() === req.query.city.toLowerCase()
        )
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with the id: ${req.query.id} successfully found in the database`,
              filteredData
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the id: ${req.query.id} not found in the DB.`
            )
          )
      }
    } else if (req.query.name && req.query.city) {
      //Find country name id and filter cities by passed 'city' query
      const countryByName = await countryModel
        .findOne({ name: req.query.name })
        .populate('cities')
      if (countryByName) {
        let filteredData = countryByName.cities.filter(
          (city) => city.name.toLowerCase() === req.query.city.toLowerCase()
        )
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with the name: ${req.query.name} and city: ${req.query.city} successfylly retrieved from the database!`,
              filteredData
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the name: ${req.query.name} and city name: ${req.query.city} not found in the DB.`
            )
          )
      }
    } else if (req.query.name && req.query.lat && req.query.lng) {
      //Find country by country name and filter cities based on passed queries: 'lat' and 'lng'
      const countryByName = await countryModel
        .findOne({ name: req.query.name })
        .populate('cities')
      if (countryByName) {
        let filteredData = countryByName.cities.filter((city) => {
          if (
            city.lat.toString() === req.query.lat &&
            city.lng.toString() === req.query.lng
          ) {
            return true
          }
        })
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with the name: ${req.query.name} and cordinates: latitude (${req.query.lat}) and longitude (${req.query.lng}) successfylly retrieved from the database!`,
              filteredData
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the name: ${req.query.name} cordinates: latitude (${req.query.lat}) and longitude (${req.query.lng}) not found in the DB!`
            )
          )
      }
    } else if (req.query.id && req.query.lat && req.query.lng) {
      //Find country by country id and filter cities based on passed queries: 'lat' and 'lng'
      const countryById = await countryModel
        .findById(req.query.id)
        .populate('cities')
      if (countryById) {
        let filteredData = countryById.cities.filter((city) => {
          if (
            city.lat.toString() === req.query.lat &&
            city.lng.toString() === req.query.lng
          ) {
            return true
          }
        })
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with the id: ${req.query.id} and cordinates: latitude (${req.query.lat}) and longitude (${req.query.lng}) successfylly retrieved from the database!`,
              filteredData
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the id: ${req.query.id} cordinates: latitude (${req.query.lat}) and longitude (${req.query.lng}) not found in the DB!`
            )
          )
      }
    } else if (
      req.query.name &&
      (req.query.gt ||
        req.query.lt ||
        req.query.gte ||
        req.query.lte ||
        req.query.population)
    ) {
      //Find country by name and filter based on one of passed queries: 'gt', 'gte', 'lt', 'lte', 'in'
      const countryByName = await countryModel
        .findOne({ name: req.query.name })
        .populate('cities')
      if (countryByName) {
        let filteredData = countryByName.cities.filter((city) => {
          //Population greater then
          if (
            req.query.gt &&
            city.population > req.query.gt &&
            city.population !== null
          ) {
            return true
          }
          //Population greater then or equal to
          else if (
            req.query.gte &&
            city.population >= req.query.gte &&
            city.population !== null
          ) {
            return true
          }
          //Population less then
          else if (
            req.query.lt &&
            city.population < req.query.lt &&
            city.population !== null
          ) {
            return true
          }
          //Population less then or equal to
          else if (
            req.query.lte &&
            city.population <= req.query.lte &&
            city.population !== null
          ) {
            return true
          } else if (
            req.query.population &&
            city.population === parseInt(req.query.population) &&
            city.population !== null
          ) {
            return true
          } else {
            return false
          }
        })
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with the name: ${req.query.name} with population${
                req.query.gt
                  ? ' greater then ' + `'${req.query.gt}'`
                  : req.query.lt
                  ? ' less then ' + `'${req.query.lt}'`
                  : req.query.gte
                  ? ' greater then or equal to ' + `'${req.query.gte}'`
                  : req.query.lte
                  ? ' less then or equal to ' + `'${req.query.lte}'`
                  : req.query.population
                  ? ' that mathes exact value of: ' +
                    `'${req.query.population}'`
                  : ''
              } successfylly retrieved from the database!`,
              filteredData.length !== 0 ? filteredData : 'No results to display'
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the name: ${req.query.name} not found in the DB.`
            )
          )
      }
    } else if (req.query.name) {
      //Find country by name and populate virtuals 'cities'
      const countryByName = await countryModel
        .findOne({ name: req.query.name })
        .populate('cities')
      if (countryByName) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with the name: ${req.query.name} successfylly retrieved from the database!`,
              countryByName
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the name: ${req.query.name} not found in the DB.`
            )
          )
      }
    } else if (req.query.id) {
      //Find country by id and populate virtuals 'cities'
      const countryById = await countryModel
        .findById(req.query.id)
        .populate('cities')
      if (countryById) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Country with the id: ${req.query.id} successfully found in the database`,
              countryById
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the id: ${req.query.id} not found in the DB.`
            )
          )
      }
    } else {
      if (Object.keys(req.query).length === 0) {
        //If req.query doesn't exist fetch all countries and populate virtuals 'cities'
        const countries = await countryModel.find().populate('cities')
        res
          .status(200)
          .json(
            new Response(
              true,
              `Countries successfully retrieved from the databse`,
              countries
            )
          )
      } else {
        res
          .status(400)
          .json(
            new Response(
              true,
              'Problem occured while trying to retrieve countries from the database'
            )
          )
      }
    }
  } catch (e) {
    console.log(e)
    res
      .status(400)
      .json(
        new Response(
          true,
          'Problem occured while trying to retrieve countries from the database',
          e.message
        )
      )
  }
})

//Get nearest and farthest cities selected country by id
module.exports.getNearestAndFarthestCities = asyncHandler(
  async (req, res, next) => {
    try {
      //Find country by passed id param
      const country = await countryModel
        .findById(req.params.id)
        .populate('cities')

      //City object
      let distanceCities = {
        city: '',
        city_2: '',
        distance: null,
      }

      //Array of city objects
      let distances = []
      //Array of city distances
      let distancesKM = []

      let min = null
      let max = null

      //Finding the max value from the array
      const maxValue = (arr) => {
        return arr.reduce(
          (max, value) => (max >= value ? max : value),
          -Infinity
        )
      }

      //Finding the min value from the array
      const minValue = (arr) => {
        return arr.reduce(
          (min, value) => (min <= value ? min : value),
          Infinity
        )
      }

      //Radius
      const R = 6371e3

      //Looping through cities and applying haversine formula
      country.cities.forEach((city) => {
        const φ1 = (city.lat * Math.PI) / 180
        country.cities.forEach((city_2) => {
          if (city.name !== city_2.name) {
            const φ2 = (city_2.lat * Math.PI) / 180
            const Δφ = ((city_2.lat - city.lat) * Math.PI) / 180
            const Δλ = ((city_2.lng - city.lng) * Math.PI) / 180

            const a =
              Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

            const d = R * c

            distanceCities = {
              city: city.name,
              city_2: city_2.name,
              distance: d / 1000,
            }

            distances.push(distanceCities)

            distancesKM.push(d / 1000)
          }
        })
      })

      min = minValue(distancesKM) //Finding the shortest distance
      max = maxValue(distancesKM) //Finding the longest distance

      const shortestDistance = distances.find(
        (distance) => distance.distance === min
      )

      const city_1_min = await cityModel.findOne({
        name: shortestDistance.city,
      })

      const city_2_min = await cityModel.findOne({
        name: shortestDistance.city_2,
      })

      const longestDistance = distances.find(
        (distance) => distance.distance === max
      )

      const city_1_max = await cityModel.findOne({ name: longestDistance.city })

      const city_2_max = await cityModel.findOne({
        name: longestDistance.city_2,
      })

      res.status(200).json(
        new Response(
          true,
          `The shortest and longest distance between cities for country: "${country.name}" along with cities is retrieved from the database`,
          {
            shortestDistance: {
              city_1: city_1_min,
              city_2: city_2_min,
              distance: `${shortestDistance.distance.toFixed(2)} KM`,
            },
            longestDistance: {
              city_1: city_1_max,
              city_2: city_2_max,
              distance: `${longestDistance.distance.toFixed(2)} KM`,
            },
          }
        )
      )
    } catch (e) {
      console.log(e)
      res
        .status(400)
        .json(
          new Response(
            true,
            'Problem occured while trying to retrieve cities in the selected country with the shortest and the longest distances between them!',
            e.message
          )
        )
    }
  }
)
