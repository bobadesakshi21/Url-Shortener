const shortUrl = require('../models/shortUrl')

exports.urlShortener = async (req, res, next) => {
  let urlObj = await shortUrl.findOne({ full: req.body.fullUrl })

  const fullUrl = req.body.fullUrl
  const customShortUrl = req.body.customShortUrl

  try {
    if (!urlObj) {
      if (!customShortUrl) {
        urlObj = await shortUrl.create({ full: fullUrl })
      } else {
        const customUrl = await shortUrl.findOne({ short: customShortUrl })
        if (customUrl) {
          const err = new Error('This name is not available. Please choose a different one.')
          err.statusCode = 409
          throw err
        }
        urlObj = await shortUrl.create({ full: fullUrl, short: customShortUrl })
      }
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
