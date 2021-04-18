const mongoose = require('mongoose')
const shortId = require('shortid')
const Schema = mongoose.Schema
const moment = require('moment')

const shortUrlSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    default: moment().format('DD-MM-YYYY')
  }
})

module.exports = mongoose.model('Url', shortUrlSchema)
