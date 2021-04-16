const express = require('express')
const app = express()

const urlRoute = require('./routes/urlShortener')
app.use('/url', urlRoute)
app.listen(process.env.PORT || 3000)
