const mongoose = require('mongoose')
const config = require('config')

const database = config.get('dbConfig.mongoURI')

const connectDB = async (req, res, next) => {
  try {
    await mongoose.connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to the database')
  } catch (err) {
    next(err)
  }
}

module.exports = connectDB
