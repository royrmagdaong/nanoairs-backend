const mongoose = require('mongoose')
const Microcontroller = require('../models/microcontroller')

module.exports = {
    getMicrocontrollers: async (req, res) => {
        try {
            const mcus = await Microcontroller.find({})

            return res.status(200).json({ response: true, data: mcus })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },
    registerMCU: async (req, res) => {
        try {
            let mcuName = req.body.mcuName
            let mcuType = req.body.mcuType
            let description = req.body.description

            let newMCU = await new Microcontroller({
                mcuName,
                mcuType,
                description
            })

            await newMCU.save().then(savedMCU => {
                res.status(200).json({newMCU: savedMCU, message: 'MCU saved!'})
            });
        } catch (error) {
            res.status(500).json({response: false, message: error.message})
        }
    }
}