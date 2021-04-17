const User = require('../models/user')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const config = require('config')

exports.signUp = async (req, res, next) => {
  const username = req.body.username
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const err = new Error('Validation Failed')
      err.statusCode = 422
      err.data = errors.array()
      throw err
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      username: username,
      name: name,
      email: email,
      password: hashedPassword
    })
    res.status(201).json(user)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
exports.login = async (req, res, next) => {
  // Get the user data from the request body
  const username = req.body.username
  const password = req.body.password

  try {
    // Check if the user exists in db
    const user = await User.findOne({ username: username })
    if (!user) {
      const err = new Error('User not found!')
      err.statusCode = 401
      throw err
    }

    // Check if the password is valid
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      const err = new Error('Wrong Password')
      err.statusCode = 401
      throw err
    }

    // Generate uuids for access and refresh token
    const accessTokenId = uuidv4()
    const refreshTokenId = uuidv4()

    // Generate access token
    const accessToken = jwt.sign({
      userId: user.id,
      sessionId: accessTokenId
    },
      config.get('accessToken.secret'),
      { expiresIn: config.get('accessToken.expiry') })

    // Generate refresh token
    const refreshToken = jwt.sign({
      userId: user.id,
      sessionId: refreshTokenId
    },
      config.get('refreshToken.secret'),
      { expiresIn: config.get('refreshToken.expiry') })

    // Add access and refresh token to the cookie
    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hr
    })
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })
    res.status(200).json({
      status: 'success'
    })
  } catch (err) {
    next(err)
  }
}
