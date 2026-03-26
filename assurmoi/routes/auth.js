const express = require('express')
const router = express.Router();
const { login, logout, forgotPassword, resetPassword } = require('../services/auth')
const { validateAuthentication } = require('../middlewares/auth')

router.post('/login', login);
router.post('/logout', validateAuthentication, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router