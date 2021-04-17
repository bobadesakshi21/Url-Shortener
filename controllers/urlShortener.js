const shortUrl = require('../models/shortUrl')
const validUrl = require('valid-url')

exports.urlShortener = async (req, res, next) => {
  const fullUrl = req.body.fullUrl
  const customShortUrl = req.body.customShortUrl

  try {
    if (!validUrl.isUri(fullUrl)) {
      const err = new Error('Entered URL is invalid')
      err.statusCode = 422
      throw err
    }
    let urlObj = await shortUrl.findOne({ full: req.body.fullUrl })

    // If the orignal url is not allready present
    if (!urlObj) {
      if (!customShortUrl) {
        urlObj = await shortUrl.create({ full: fullUrl })
        return
      }
      const customUrl = await shortUrl.findOne({ short: customShortUrl })
      if (customUrl) {
        const err = new Error('This short name for the URL is not available. Please choose a different one.')
        err.statusCode = 409
        throw err
      }
      urlObj = await shortUrl.create({ full: fullUrl, short: customShortUrl })
    }
    res.status(201).json({
      shortUrl: urlObj.short
    })
  } catch (err) {
    return next(err)
  }
}

exports.redirectToOrignalUrl = async (req, res, next) => {
  const shortParam = req.params.shortUrl
  const urlObj = await shortUrl.findOne({ short: shortParam })

  if (!urlObj) return res.sendStatus(404)

  urlObj.clicks++
  urlObj.save()

  res.redirect(urlObj.full)
}
