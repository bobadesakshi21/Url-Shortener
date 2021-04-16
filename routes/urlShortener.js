const express = require('express')
const router = express.Router()
const urlController = require('../controllers/urlShortener')

router.post('/', urlController.urlShortener)

module.exports = router
