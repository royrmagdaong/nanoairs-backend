const mongoose = require('mongoose')
const Schema = mongoose.Schema

const microcontrollerSchema = Schema({
    mcuName: String,
    mcuType: String,
    description: String,
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

module.exports = mongoose.model('Microcontroller', microcontrollerSchema)