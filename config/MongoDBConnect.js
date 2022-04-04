const mongoose = require('mongoose')

const MongoDBConnect = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URL)
  console.log(
    `Mongo DB connected! ${connection.connection.host}:${connection.connection.port}\n`
  )
}

module.exports = MongoDBConnect
