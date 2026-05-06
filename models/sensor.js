const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sensorSchema = Schema({
    microcontrollerID: String,
    siteName: String,
    sensor: [{ sensorType: String, reading: Number }],
    pondNumber: { type: Number },
    readingDate: { type: Date },
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    deleted_at:{
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('Sensor', sensorSchema)