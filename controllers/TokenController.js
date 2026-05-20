const Token = require('../models/token')
const moment = require('moment')
const momentTimezone = require('moment-timezone')

const convertToUTC8 = (dateOrUnix) => {
    return momentTimezone.unix(dateOrUnix).tz('Asia/Manila').toDate()
}

const getTokenDuration = (iat, exp) => {
    const start = moment.unix(iat)
    const end = moment.unix(exp)
    return Math.floor(moment.duration(end.diff(start)).asDays())
}

const sanitizeToken = (token) => {
    if (!token) return null
    const { _id, user_id, duration, expired_at, created_at } = token
    return { _id, user_id, duration, expired_at, created_at }
}

module.exports = {
    getAllTokens: async (req, res) => {
        try {
            const { user_id, limit = 50, skip = 0 } = req.query
            const query = { deleted_at: null }

            if (user_id) {
                query.user_id = user_id
            }

            const tokens = await Token.find(query)
                .select('-token -__v')
                .sort({ created_at: -1 })
                .limit(Number(limit))
                .skip(Number(skip))
                .exec()

            const total = await Token.countDocuments(query)
            return res.status(200).json({
                error: false,
                data: tokens.map(sanitizeToken),
                pagination: { total, limit: Number(limit), skip: Number(skip) }
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    },

    saveToken: async (req, res) => {
        try {
            const user_id = req.body.user_id || (req.user && req.user._id)
            const token = req.body.token || (req.user && req.user.token)
            const iat = req.body.iat || (req.user && req.user.iat)
            const exp = req.body.exp || (req.user && req.user.exp)

            if (!user_id || !token || !iat || !exp) {
                return res.status(400).json({ error: true, message: 'user_id, token, iat, and exp are required.' })
            }

            const tokenDoc = new Token({
                user_id,
                token,
                duration: getTokenDuration(iat, exp),
                expired_at: convertToUTC8(exp)
            })

            const savedToken = await tokenDoc.save()
            return res.status(201).json({
                error: false,
                data: sanitizeToken(savedToken.toObject()),
                message: 'Token saved successfully.'
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    }
}