const express = require('express')
router = express.Router()

const LogController = require('../controllers/LogController')


// routes
router.get('/', LogController.getLogs)
router.post('/create', LogController.createLog)

module.exports = router