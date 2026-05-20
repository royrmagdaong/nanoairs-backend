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
    const sensor = payload.sensor
    if (!sensor || !Array.isArray(sensor) || sensor.length === 0) {
        return 'sensor is required and must be a non-empty array.'
    }
    const invalidEntry = sensor.find((item) => !item || typeof item.sensorType !== 'string' || typeof item.reading !== 'number')
    if (invalidEntry) {
        return 'Each sensor entry must include sensorType (string) and reading (number).'
    }
    return null
}

const sanitizeSensor = (sensor) => {
    if (!sensor) return null
    const { _id, microcontrollerID, siteName, sensor: readings, pondNumber, readingDate, created_at } = sensor
    return { _id, microcontrollerID, siteName, sensor: readings, pondNumber, readingDate, created_at }
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
                sensor: req.body.sensor,
                pondNumber: req.body.pondNumber,
                readingDate: req.body.readingDate ? new Date(req.body.readingDate) : new Date()
            }

            const validationError = validateSensorPayload(payload)
            if (validationError) {
                return res.status(400).json({ error: true, message: validationError })
            }

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
