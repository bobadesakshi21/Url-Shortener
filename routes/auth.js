const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const User = require('../models/user')

const authController = require('../controllers/auth')

router.post('/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email-address')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email address already exists')
            }
          })
      })
      .normalizeEmail(),
    body('username')
      .custom((value, { req }) => {
        return User.findOne({ username: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Username is not available. Choose a different one')
            }
          })
      }),
    body('password')
      .isLength({ min: 4 })
      .withMessage('Password is too short.')
  ], authController.signUp)

router.post('/login', authController.login)

module.exports = router
