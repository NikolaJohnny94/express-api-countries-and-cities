const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.resolve(__dirname, 'config', '.env'),
})
const userRouter = require('./routes/userRoute')
const countryRouter = require('./routes/countryRoute')
const cityRouter = require('./routes/cityRoute')
const MongoDBConnect = require('./config/MongoDBConnect')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')

MongoDBConnect()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/api/v1', userRouter)
app.use('/api/v1', countryRouter)
app.use('/api/v1', cityRouter)

app.listen(process.env.PORT, () => {
  console.log(
    `\nServer running in ${process.env.NODE_ENV} mode on: ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
  )
})
