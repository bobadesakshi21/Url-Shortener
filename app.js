const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Sakshi:sakshi123@cluster0.vpzlm.mongodb.net/urlShortener?retryWrites=true&w=majority')

const urlRoute = require('./routes/urlShortener')
app.use('/url', urlRoute)
app.listen(process.env.PORT || 3000)
