const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const connectDB = require('./config/database')

connectDB()

app.use(bodyParser.json())
app.use(cookieParser())

const urlRoute = require('./routes/urlShortener')
const userRoute = require('./routes/auth')

app.use('/url', urlRoute)
app.use('/user', userRoute)

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
