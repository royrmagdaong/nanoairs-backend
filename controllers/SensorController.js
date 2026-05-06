const mongoose = require('mongoose')
const Sensor = require('../models/sensor')

module.exports = {
    getSensor: async (req, res) => {
        try {
            return res.status(200).json({ message: 'success' })
        } catch (error) {
            return res.status(500).json({message: 'error'})
        }
    },
    insertSensorReading: async (req, res) => {
        try {
            let microcontrollerID = req.body.microcontrollerID
            let siteName = req.body.siteName
            let sensor = req.body.sensor
            let pondNumber = req.body.pondNumber
            let readingDate = req.body.readingDate

            let newSensor = await new Sensor({
                microcontrollerID,
                siteName,
                sensor,
                pondNumber,
                readingDate
            })

            await newSensor.save().then(savedSensor => {
                res.status(200).json({newSensorReading: savedSensor, message: 'sent successfully!'})
            });

        } catch (error) {
            res.status(500).json({error: true, message: error.message})
        }
    },
}