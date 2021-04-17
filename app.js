const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const connectDB = require('./config/database')

connectDB()

app.use(bodyParser.json())

const urlRoute = require('./routes/urlShortener')
const userRoute = require('./routes/auth')

app.use('/url', urlRoute)
app.user('/user', userRoute)

// Error Handling
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const data = error.data
  const message = error.message
  res.status(statusCode).json({
    message: message,
    data: data
  })
})

app.listen(process.env.PORT || 3000)
