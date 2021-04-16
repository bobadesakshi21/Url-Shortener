const express = require('express')
const router = express.Router()
const urlController = require('../controllers/urlShortener')

router.get('/', urlController.urlSortener)
module.exports = router
