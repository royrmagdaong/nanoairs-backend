const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token: String,
    duration: String,
    expired_at:{
        type: Date,
        default: null
    },
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

module.exports = mongoose.model('Token', tokenSchema)