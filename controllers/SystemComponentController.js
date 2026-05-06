const mongoose = require('mongoose')
const SystemComponent = require('../models/system-component')

module.exports = {
    getSystemComponents: async (req, res) => {
        try {
            const systemComponent = await SystemComponent.find({})

            return res.status(200).json({ response: true, data: systemComponent })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    },
    createSystemComponent: async (req, res) => {
        try {
            let name = req.body.name
            let description = req.body.description
            let status = req.body.status

            let systemComponent = await new SystemComponent({
                name,
                description,
                status
            })

            await systemComponent.save().then(savedSystemComponent => {
                res.status(200).json({newSystemComponent: savedSystemComponent, message: 'System component saved!'})
            });
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
}