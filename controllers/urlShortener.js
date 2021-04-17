const { ObjectId } = require('mongodb')
const shortUrl = require('../models/shortUrl')
const validUrl = require('valid-url')
const { validationResult } = require('express-validator')
const UserAgent = require('user-agents')
const geoip = require('geoip-lite')

const Url = require('../models/shortUrl')

exports.urlShortener = async (req, res, next) => {
  const title = req.body.title
  const fullUrl = req.body.fullUrl
  const customShortUrl = req.body.customShortUrl
  const userId = req.userId

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({
      errorMessage: errors.array()
    })
  }

  try {
    if (!validUrl.isUri(fullUrl)) {
      const err = new Error('Entered URL is invalid')
      err.statusCode = 422
      throw err
    }
    let urlObj = await shortUrl.findOne({ full: req.body.fullUrl })

    // If the orignal url is not allready present
    if (!urlObj) {
      if (customShortUrl) {
        const customUrl = await shortUrl.findOne({ short: customShortUrl })
        if (customUrl) {
          const err = new Error('This short name for the URL is not available. Please choose a different one.')
          err.statusCode = 409
          throw err
        }
      }

      urlObj = await shortUrl.create({
        title: title,
        full: fullUrl,
        short: customShortUrl,
        userId: userId
      })
    }
    res.status(201).json({
      shortUrl: urlObj.short
    })
  } catch (err) {
    return next(err)
  }
}

exports.editUrl = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({
      errorMessage: errors.array()
    })
  }

  try {
    const urlId = req.body.urlId
    const updatedTitle = req.body.title
    const updatedFullUrl = req.body.fullUrl
    const updatedCustomShortUrl = req.body.customShortUrl

    const id = ObjectId(urlId)
    const editUrl = await Url.findById(id)

    if (!editUrl) {
      const error = new Error('Invalid url id')
      error.statusCode = 404
      throw error
    }
    if (editUrl.userId.toString() !== req.userId) {
      const error = new Error('Not authorized')
      error.statusCode = 403
      throw error
    }
    editUrl.title = updatedTitle
    editUrl.full = updatedFullUrl
    editUrl.short = updatedCustomShortUrl

    await editUrl.save()
    res.status(200).send(editUrl)
  } catch (err) {
    const error = new Error(err)
    error.StatusCode = 500
    return next(error)
  }
}

exports.redirectToOrignalUrl = async (req, res, next) => {
  const shortParam = req.params.shortUrl
  const urlObj = await shortUrl.findOne({ short: shortParam })

  if (!urlObj) return res.sendStatus(404)

  urlObj.clicks++
  urlObj.save()

  const userAgent = new UserAgent()
  const device = userAgent.deviceCategory

  let ipAddress = req.ip
  if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
    ipAddress = '17.233.175.255'
  }
  const geo = geoip.lookup(ipAddress)
  const country = geo.country

  res.redirect(urlObj.full)
}
