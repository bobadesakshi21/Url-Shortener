const mongoose = require('mongoose')
const Schema = mongoose.Schema

const locationSchema = new Schema({
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
  percentage: {
    type: Number,
    required: true,
    default: 0.0
  }
})

module.exports = mongoose.model('Location', locationSchema)
