const express = require('express')
const router = express.Router();
const { login, logout } = require('../services/auth')
const { validateAuthentication } = require('../middlewares/auth')

router.post('/login', login);
router.post('/logout', validateAuthentication, logout);

module.exports = router