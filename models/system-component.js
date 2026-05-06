const mongoose = require('mongoose')
const Schema = mongoose.Schema

const systemComponentSchema = Schema({
    name: String,
    status: String,
    description: String,
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: null
    },
    deleted_at:{
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('SystemComponent', systemComponentSchema)