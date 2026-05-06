const express = require('express')
router = express.Router()

const TokenController = require('../controllers/TokenController')
const authenticate = require('../middlewares/authenticate')


// routes
router.get('/', TokenController.getAllTokens)
router.post('/save-token', 
    authenticate,
    TokenController.saveToken
)

module.exports = router