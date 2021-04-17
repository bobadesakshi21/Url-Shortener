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

router.get('/:shortUrl', urlController.redirectToOrignalUrl)

router.get('/locationMetrics/:urlId', isAuth, urlController.locationMetrics)

router.get('/deviceMetrics/:urlId', isAuth, urlController.deviceMetrics)

module.exports = router
