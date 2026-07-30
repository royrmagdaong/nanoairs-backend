const Sensor = require('../models/sensor')

const validateSensorPayload = (payload) => {
    if (!payload) return 'Request body is required.'
    if (!payload.microcontrollerID || typeof payload.microcontrollerID !== 'string') {
        return 'microcontrollerID is required and must be a string.'
    }
    if (!payload.siteName || typeof payload.siteName !== 'string') {
        return 'siteName is required and must be a string.'
    }
    if (!payload.pondNumber || typeof payload.pondNumber !== 'number') {
        return 'pondNumber is required and must be a number.'
    }
    if (!payload.pH || typeof payload.pH !== 'number') {
        return 'pH is required and must be a number.'
    }
    if (!payload.salinity || typeof payload.salinity !== 'number') {
        return 'Salinity is required and must be a number.'
    }
    if (!payload.dissolved_oxygen || typeof payload.dissolved_oxygen !== 'number') {
        return 'Dissolved oxygen is required and must be a number.'
    }
    if (!payload.temperature || typeof payload.temperature !== 'number') {
        return 'Temperature is required and must be a number.'
    }
    if (!payload.alkalinity || typeof payload.alkalinity !== 'number') {
        return 'Alkalinity is required and must be a number.'
    }
    if (!payload.co2 || typeof payload.co2 !== 'number') {
        return 'CO2 is required and must be a number.'
    }
    return null
}

const sanitizeSensor = (sensor) => {
    if (!sensor) return null
    const { _id, microcontrollerID, siteName, pH, salinity, dissolved_oxygen, temperature, alkalinity, co2, pondNumber, readingDate, created_at } = sensor
    return { _id, microcontrollerID, siteName, pH, salinity, dissolved_oxygen, temperature, alkalinity, co2, pondNumber, readingDate, created_at }
}

module.exports = {
    getSensor: async (req, res) => {
        try {
            const { id, microcontrollerID } = req.query
            const query = { deleted_at: null }

            if (id) {
                const sensor = await Sensor.findOne({ _id: id, deleted_at: null })
                    .select('-__v')
                    .exec()
                if (!sensor) {
                    return res.status(404).json({ error: true, message: 'Sensor entry not found.' })
                }
                return res.status(200).json({ error: false, data: sanitizeSensor(sensor) })
            }

            if (microcontrollerID) {
                query.microcontrollerID = microcontrollerID
            }

            const sensors = await Sensor.find(query)
                .select('-__v')
                .sort({ created_at: -1 })
                .exec()

            return res.status(200).json({ error: false, data: sensors.map(sanitizeSensor) })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    },
    getSensorByMicrocontrollerID: async (req, res) => {

    },
    getSensorCountByMicrocontrollerID: async (req, res) => {

    },
    getSensors: async (req, res) => {
        try {
            const { siteName, pondNumber, limit = 100, skip = 0 } = req.query
            const query = { deleted_at: null }

            if (siteName) {
                query.siteName = siteName
            }

            if (pondNumber) {
                query.pondNumber = Number(pondNumber)
            }

            const sensors = await Sensor.find(query)
                .select('-__v')
                .sort({ created_at: -1 })
                .limit(Number(limit))
                .skip(Number(skip))
                .exec()

            const total = await Sensor.countDocuments(query)

            return res.status(200).json({
                error: false,
                data: sensors.map(sanitizeSensor),
                pagination: { total, limit: Number(limit), skip: Number(skip) }
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    },
    insertSensorReading: async (req, res) => {
        try {
            const payload = {
                microcontrollerID: req.body.microcontrollerID,
                siteName: req.body.siteName,
                pH: req.body.pH,
                salinity: req.body.salinity,
                dissolved_oxygen: req.body.dissolved_oxygen,
                temperature: req.body.temperature,
                alkalinity: req.body.alkalinity,
                co2: req.body.co2,
                pondNumber: req.body.pondNumber,
                readingDate: req.body.readingDate ? new Date(req.body.readingDate) : new Date()
            }

            const validationError = validateSensorPayload(payload)
            if (validationError) {
                return res.status(400).json({ error: true, message: validationError })
            }

            // catch error here when saving records fails
            // log all errors, create error model to log all sensor errors

            const sensor = new Sensor(payload)
            const savedSensor = await sensor.save()

            return res.status(201).json({
                error: false,
                data: sanitizeSensor(savedSensor.toObject()),
                message: 'Sensor reading recorded successfully.'
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    }
}
