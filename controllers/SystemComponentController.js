const SystemComponent = require('../models/system-component')

const validateComponentPayload = (payload) => {
    if (!payload) return 'Request body is required.'
    if (!payload.name || typeof payload.name !== 'string') {
        return 'name is required and must be a string.'
    }
    if (payload.description && typeof payload.description !== 'string') {
        return 'description must be a string.'
    }
    if (payload.status && !['active', 'inactive', 'maintenance'].includes(payload.status)) {
        return 'status must be one of: active, inactive, maintenance.'
    }
    return null
}

const sanitizeComponent = (component) => {
    if (!component) return null
    const { _id, name, description, status, created_at, updated_at } = component
    return { _id, name, description, status, created_at, updated_at }
}

module.exports = {
    getSystemComponents: async (req, res) => {
        try {
            const { id, status } = req.query
            const query = {}

            if (id) {
                const component = await SystemComponent.findById(id).select('-__v').exec()
                if (!component) {
                    return res.status(404).json({ error: true, message: 'System component not found.' })
                }
                return res.status(200).json({ error: false, data: sanitizeComponent(component) })
            }

            if (status) {
                query.status = status
            }

            const components = await SystemComponent.find(query)
                .select('-__v')
                .sort({ created_at: -1 })
                .exec()
            return res.status(200).json({ error: false, data: components.map(sanitizeComponent) })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    },

    createSystemComponent: async (req, res) => {
        try {
            const payload = {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status 
            }

            const validationError = validateComponentPayload(payload)
            if (validationError) {
                return res.status(400).json({ error: true, message: validationError })
            }

            const component = new SystemComponent(payload)
            const savedComponent = await component.save()
            return res.status(201).json({
                error: false,
                data: sanitizeComponent(savedComponent.toObject()),
                message: 'System component created successfully.'
            })
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message })
        }
    }
}