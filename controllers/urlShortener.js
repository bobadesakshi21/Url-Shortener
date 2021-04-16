const shortUrl = require('../models/shortUrl')

exports.urlShortener = async (req, res, next) => {
  let urlObj = await shortUrl.findOne({ full: req.body.fullUrl })

  const fullUrl = req.body.fullUrl
  const customShortUrl = req.body.customShortUrl

  if (!urlObj) {
    if (customShortUrl) {
      const customUrl = await shortUrl.findOne({ short: customShortUrl })
      if (customUrl) {
        res.status(409).json({})
      }
    }
    urlObj = await shortUrl.create({ full: fullUrl, short: customShortUrl })
  }

  res.status(201).json({
    shortUrl: urlObj.short
  })
}

exports.redirectToOrignalUrl = async (req, res, next) => {
  const shortParam = req.params.shortUrl
  const urlObj = await shortUrl.findOne({ short: shortParam })

  if (!urlObj) return res.sendStatus(404)

  urlObj.clicks++
  urlObj.save()

  res.redirect(urlObj.full)
}
