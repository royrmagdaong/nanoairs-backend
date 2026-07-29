const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sensorSchema = Schema({
    microcontrollerID: String,
    siteName: String,
    pH:{ type: Number },
    dissolved_oxygen:{ type: Number },
    salinity:{ type: Number },
    temperature:{ type: Number },
    alkalinity:{ type: Number },
    co2:{ type: Number },
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