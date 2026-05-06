const express = require('express')
router = express.Router()

const UserController = require('../controllers/UserController')


// routes
router.get('/', UserController.getUser)
router.post('/create', UserController.createUser)

module.exports = router