const express = require('express')
router = express.Router()

const SensorController = require('../controllers/SensorController')
const authenticate = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')

// routes
router.get('/', 
    authenticate,
    authorization(['user', 'admin']),
    SensorController.getSensor
)
router.post('/insert', 
    authenticate,
    authorization(['user', 'admin']),
    SensorController.insertSensorReading
)

module.exports = router