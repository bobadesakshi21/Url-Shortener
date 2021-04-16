const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb+srv://Sakshi:sakshibobade@cluster0.vpzlm.mongodb.net/url-shortener?retryWrites=true&w=majority')

app.use(bodyParser.json())

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const data = error.data
  const message = error.message
  res.status(statusCode).json({
    message: message,
    data: data
  })
})
const urlRoute = require('./routes/urlShortener')
app.use('/url', urlRoute)
app.listen(process.env.PORT || 3000)
