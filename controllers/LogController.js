const Log = require('../models/log')

const validateLogPayload = (payload) => {
    if (!payload) return 'Request body is required.'
    if (!payload.user_id || typeof payload.user_id !== 'string') {
        return 'user_id is required and must be a string.'
    }
    if (!payload.actionType || typeof payload.actionType !== 'string') {
        return 'actionType is required and must be a string.'
    }
    if (payload.description && typeof payload.description !== 'string') {
        return 'description must be a string.'
    }
    return null
}

const sanitizeLog = (log) => {
    if (!log) return null
    const { _id, user_id, actionType, description, created_at } = log
    return { _id, user_id, actionType, description, created_at }
}

module.exports = {
    getLogs: async (req, res) => {
        try {
            const { id, user_id, limit = 100, skip = 0 } = req.query
            const query = {}

            if (id) {
                const log = await Log.findById(id).select('-__v').exec()
                if (!log) {
                    return res.status(404).json({ error: true, message: 'Log not found.' })
                }
                return res.status(200).json({ error: false, data: sanitizeLog(log) })
            }

            if (user_id) {
                query.user_id = user_id
            }

            const logs = await Log.find(query)
                .select('-__v')
                .sort({ created_at: -1 })
                .limit(Number(limit))
                .skip(Number(skip))
                .exec()

            const total = await Log.countDocuments(query)
            return res.status(200).json({
                error: false,
                data: logs.map(sanitizeLog),
                pagination: { total, limit: Number(limit), skip: Number(skip) }
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    },

    createLog: async (req, res) => {
        try {
            const payload = {
                user_id: req.body.user_id,
                actionType: req.body.actionType,
                description: req.body.description
            }

            const validationError = validateLogPayload(payload)
            if (validationError) {
                return res.status(400).json({ error: true, message: validationError })
            }

            const log = new Log(payload)
            const savedLog = await log.save()
            return res.status(201).json({
                error: false,
                data: sanitizeLog(savedLog.toObject()),
                message: 'Log created successfully.'
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    }
}