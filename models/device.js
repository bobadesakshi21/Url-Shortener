const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deviceSchema = new Schema({
  urlId: {
    type: Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  device: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('Device', deviceSchema)
