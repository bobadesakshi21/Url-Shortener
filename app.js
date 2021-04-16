const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb+srv://Sakshi:sakshibobade@cluster0.vpzlm.mongodb.net/url-shortener?retryWrites=true&w=majority')

app.use(bodyParser.json())

const urlRoute = require('./routes/urlShortener')
app.use('/url', urlRoute)
app.listen(process.env.PORT || 3000)
