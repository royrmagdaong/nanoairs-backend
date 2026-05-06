const express = require('express')
router = express.Router()

const SensorController = require('../controllers/SensorController')


// routes
router.get('/', SensorController.getSensor)
router.post('/insert', SensorController.insertSensorReading)

module.exports = router