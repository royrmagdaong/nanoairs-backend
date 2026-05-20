const Microcontroller = require('../models/microcontroller')

const validateMCUPayload = (payload) => {
    if (!payload) return 'Request body is required.'
    if (!payload.mcuName || typeof payload.mcuName !== 'string') {
        return 'mcuName is required and must be a string.'
    }
    if (!payload.mcuType || typeof payload.mcuType !== 'string') {
        return 'mcuType is required and must be a string.'
    }
    if (payload.description && typeof payload.description !== 'string') {
        return 'description must be a string.'
    }
    return null
}

const sanitizeMCU = (mcu) => {
    if (!mcu) return null
    const { _id, mcuName, mcuType, description, created_at, updated_at } = mcu
    return { _id, mcuName, mcuType, description, created_at, updated_at }
}

module.exports = {
    getMicrocontrollers: async (req, res) => {
        try {
            const { id } = req.query
            
            if (id) {
                const mcu = await Microcontroller.findById(id).select('-__v').exec()
                if (!mcu) {
                    return res.status(404).json({ error: true, message: 'Microcontroller not found.' })
                }
                return res.status(200).json({ error: false, data: sanitizeMCU(mcu) })
            }

            const mcus = await Microcontroller.find({})
                .select('-__v')
                .sort({ created_at: -1 })
                .exec()
            return res.status(200).json({ error: false, data: mcus.map(sanitizeMCU) })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    },

    registerMCU: async (req, res) => {
        try {
            const payload = {
                mcuName: req.body.mcuName,
                mcuType: req.body.mcuType,
                description: req.body.description
            }

            const validationError = validateMCUPayload(payload)
            if (validationError) {
                return res.status(400).json({ error: true, message: validationError })
            }

            const mcu = new Microcontroller(payload)
            const savedMCU = await mcu.save()
            return res.status(201).json({
                error: false,
                data: sanitizeMCU(savedMCU.toObject()),
                message: 'Microcontroller registered successfully.'
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    }
}