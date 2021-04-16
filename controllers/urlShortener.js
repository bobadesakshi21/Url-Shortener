const shortUrl = require('../models/shortUrl')

exports.urlShortener = async (req, res, next) => {
  await shortUrl.create({ full: req.body.fullUrl })

  const shortUrlObj = await shortUrl.findOne({ full: req.body.fullUrl })

  res.status(201).json({
    shortUrl: shortUrlObj.short
  })
}
