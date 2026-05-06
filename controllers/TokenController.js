const mongoose = require('mongoose')
const Token = require('../models/token')
const moment = require('moment')
const momentTimezone = require('moment-timezone')

const convertToUTC8 = (date) => {
    return momentTimezone.unix(date).tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
}
const getTokenDuration = (iat, exp) => {
    const start = moment.unix(iat);
    const end = moment.unix(exp);
    return moment.duration(end.diff(start)).asDays()
}

module.exports = {
    getAllTokens: async (req, res) => {
        try {
            let tokens = await Token.find({})
            return res.status(200).json({ response: true, data: tokens })
        } catch (error) {
            return res.status(500).json({ response: false, message: error.message })
        }
    },
    saveToken: async (req, res) => {
        try {
            let user_id = res.user._id
            let token = res.user.token
            let iat =  res.user.iat
            let exp = res.user.exp

            let newToken = await new Token({
                user_id,
                token,
                duration: getTokenDuration(iat, exp),
                expired_at: convertToUTC8(exp)
            })

            await newToken.save().then(savedToken => {
                res.status(200).json({newToken: savedToken, message: 'token saved!'})
            });

        } catch (error) {
            res.status(500).json({error: true, message: error.message})
        }
    },
}