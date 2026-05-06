const mongoose = require('mongoose')
const Log = require('../models/log')

module.exports = {
    getLogs: async (req, res) => {
        try {
            const logs = await Log.find({})

            return res.status(200).json({ response: true, data: logs })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },
}