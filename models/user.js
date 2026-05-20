const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    role: { type: String, required: true },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    verificationCode: { type: String, required: false },
    is_verified: { type: Boolean, default: true },
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

module.exports = mongoose.model('User', userSchema)

// ...existing code...
// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')

// const userSchema = new mongoose.Schema({
//     role: { type: String, required: true },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true,
//         match: [/^\S+@\S+\.\S+$/, 'Invalid email']
//     },
//     password: {
//         type: String,
//         required: true,
//         select: false
//     },
//     verificationCode: { type: String, required: false, select: false },
//     is_verified: { type: Boolean, default: false },
//     deleted_at: { type: Date, default: null, index: true }
// }, {
//     timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
// })

// // Hash password before save
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next()
//     try {
//         const salt = await bcrypt.genSalt(10)
//         this.password = await bcrypt.hash(this.password, salt)
//         next()
//     } catch (err) {
//         next(err)
//     }
// })

// // Instance method to compare password (remember to select('+password') when fetching)
// userSchema.methods.comparePassword = function (candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password)
// }

// // Remove sensitive fields when converting to JSON
// userSchema.set('toJSON', {
//     transform: (doc, ret) => {
//         delete ret.password
//         delete ret.verificationCode
//         delete ret.__v
//         return ret
//     }
// })

// module.exports = mongoose.model('User', userSchema)
// // ...existing code...