const asyncHandler = require('express-async-handler')
const cityModel = require('../models/City')
const countryModel = require('../models/Country')
const Response = require('../utils/Response')

//GET all cities, search by queries: name, lat & lng, country, countryId, gt, gte, lt, lte, population
module.exports.getCities = asyncHandler(async (req, res, next) => {
  try {
    if (req.query.name) {
      const cityByName = await cityModel.findOne({
        name: req.query.name,
      })
      if (cityByName) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `City with name: ${req.query.name} successfully retrieved form the database!`,
              cityByName
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `City with name: ${req.query.name} not found in the database!`
            )
          )
      }
    } else if (req.query.lat && req.query.lng) {
      const cityByCoridantes = await cityModel.findOne({
        lat: req.query.lat,
        lng: req.query.lng,
      })
      if (cityByCoridantes) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `City with cordinates: latitude -> ${req.query.lat} and longitude -> ${req.query.lng} successfully retrvieved from the databse!`,
              cityByCoridantes
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `City with cordinates: latitude -> ${req.query.lat} and longitude -> ${req.query.lng} not found in the databse!`
            )
          )
      }
    } else if (req.query.country) {
      const citiesInSelectedCountry = await cityModel.find({
        countryName: req.query.country,
      })
      if (citiesInSelectedCountry) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Cities in country ${req.query.country} successfully retrieved from the database!`,
              citiesInSelectedCountry
            )
          )
      } else {
        res
          .status(400)
          .json(
            new Response(
              true,
              `Country with name: ${req.query.country} not found in the database`,
              citiesInSelectedCountry
            )
          )
      }
    } else if (req.query.countryId) {
      const country = await countryModel.findById(req.query.countryId)
      if (country) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Cities in the selected country -> id: ${req.query.countryId}, name: ${country.name} successfully retrieved from the database!`,
              city
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Country with the id: ${req.query.countryId} not found in the database`
            )
          )
      }
    } else if (req.query.gt) {
      const populationGreaterThen = await cityModel.find({
        population: { $gt: req.query.gt },
      })
      if (populationGreaterThen) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Cities with population greater then: ${req.query.gt} retrieved from the database!`,
              populationGreaterThen
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Problem occured while trying to retrieve cities with the population greater then: ${req.query.gt}`
            )
          )
      }
    } else if (req.query.gte) {
      const populationGreaterThenOrEqual = await cityModel.find({
        population: { $gte: req.query.gte },
      })
      if (populationGreaterThenOrEqual) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Cities with population greater then or equalto ${req.query.gte} retrieved from the database!`,
              populationGreaterThenOrEqual
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Problem occured while trying to retrieve cities with the population greater then or qual to ${req.query.gte}`
            )
          )
      }
    } else if (req.query.lt) {
      const populationLesserThen = await cityModel.find({
        population: { $lt: req.query.lt },
      })
      if (populationLesserThen) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Cities with population less then: ${req.query.lt} retrieved from the database!`,
              populationLesserThen
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Problem occured while trying to retrieve cities with the population lesser then: ${req.query.lt}`
            )
          )
      }
    } else if (req.query.lte) {
      const populationLesserThenOrEqual = await cityModel.find({
        population: { $lte: req.query.lte },
      })
      if (populationLesserThenOrEqual) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Cities with population less then or equal to ${req.query.lte} retrieved from the database!`,
              populationLesserThenOrEqual
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Problem occured while trying to retrieve cities with the population lesser then or equal ${req.query.lte}`
            )
          )
      }
    } else if (req.query.population) {
      const populationExactMatch = await cityModel.find({
        population: { $in: req.query.population },
      })
      if (populationExactMatch) {
        res
          .status(200)
          .json(
            new Response(
              true,
              `Cities with population that match exact ${req.query.population} retrieved from the database!`,
              populationExactMatch
            )
          )
      } else {
        res
          .status(404)
          .json(
            new Response(
              false,
              `Problem occured while trying to retrieve cities with the population that match exact: ${req.query.population}`
            )
          )
      }
    } else {
      if (Object.keys(req.query).length === 0) {
        const cities = await cityModel.find()
        res
          .status(200)
          .json(
            new Response(true, 'Cities retrieved from the database!', cities)
          )
      } else {
        res
          .status(400)
          .json(
            new Response(
              false,
              'Problem ocurred while trying to retrieve cities from the database'
            )
          )
      }
    }
  } catch (e) {
    console.log()
    res
      .status(400)
      .json(
        new Response(
          false,
          'Problem ocurred while trying to retrieve cities from the database',
          e.message
        )
      )
  }
})

//GET city by id
module.exports.getCity = asyncHandler(async (req, res, next) => {
  try {
    const city = await cityModel.findById(req.params.id)
    if (city) {
      res
        .status(200)
        .json(
          new Response(
            true,
            `City with the id: ${req.params.id} successfully retrieved from the database!`,
            city
          )
        )
    } else {
      res
        .status(404)
        .json(
          new Response(
            false,
            `City with the id: ${req.params.id} not found in the database`
          )
        )
    }
  } catch (e) {
    console.log(e)
    res.status(400).json(new Response(false, `Error occured: ${e.message}!`))
  }
})
