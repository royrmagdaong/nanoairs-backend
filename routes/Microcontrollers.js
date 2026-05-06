const express = require('express')
router = express.Router()

const MicrocontrollerController = require('../controllers/MicrocontrollerController')
const authenticate = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')


// routes
router.get('/', MicrocontrollerController.getMicrocontrollers)
router.post('/register', 
    authenticate,
    authorization(['user', 'admin']),
    MicrocontrollerController.registerMCU
)

module.exports = router