const express = require('express')
router = express.Router()

const LogController = require('../controllers/LogController')


// routes
router.get('/', LogController.getLogs)

module.exports = router