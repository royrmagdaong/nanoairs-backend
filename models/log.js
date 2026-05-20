const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    actionType: String,
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

module.exports = mongoose.model('Log', logSchema)