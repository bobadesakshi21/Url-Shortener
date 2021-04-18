const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const dateSchema = new Schema({
  urlId: {
    type: Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  country: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: String,
    default: moment().format('DD-MM-YYYY`')
  }
})

module.exports = mongoose.model('Date', dateSchema)
