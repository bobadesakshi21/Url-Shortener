const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const userSchema = new Schema({
  username: {
    type: 'String',
    required: true
  },
  name: {
    type: 'String',
    required: true
  },
  email: {
    type: 'String',
    required: true
  },
  password: {
    type: 'String',
    required: true
  },
  date: {
    type: String,
    default: moment().format('DD-MM-YYYY')
  }
})

module.exports = mongoose.model('User', userSchema)
