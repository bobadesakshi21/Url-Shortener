const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const urlController = require('../controllers/urlShortener')
const isAuth = require('../middleware/is-auth')

router.post('/',
  [
    body('title', 'Title must be at least 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim()
  ], isAuth, urlController.urlShortener)

router.post('/edit',
  [
    body('title', 'Title must be at least 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim()
  ], isAuth, urlController.editUrl)

router.get('/:shortUrl', isAuth, urlController.redirectToOrignalUrl)

router.post('/locationMetrics/:urlId', isAuth, urlController.locationMetrics)

router.get('/deviceMetrics/:urlId', isAuth, urlController.deviceMetrics)

router.post('/deviceLocMetrics/:urlId', isAuth, urlController.devicePerLocation)

module.exports = router
