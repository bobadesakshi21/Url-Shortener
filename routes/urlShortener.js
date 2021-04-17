const express = require('express')
const router = express.Router()
const urlController = require('../controllers/urlShortener')
const isAuth = require('../middleware/is-auth')

router.post('/', isAuth, urlController.urlShortener)

router.get('/:shortUrl', isAuth, urlController.redirectToOrignalUrl)

module.exports = router
