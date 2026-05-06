const express = require('express')
router = express.Router()

const SystemComponentController = require('../controllers/SystemComponentController')
const authenticate = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')


// routes
router.get('/', SystemComponentController.getSystemComponents)
router.post('/create', 
    authenticate,
    authorization(['user','admin']),
    SystemComponentController.createSystemComponent
)

module.exports = router