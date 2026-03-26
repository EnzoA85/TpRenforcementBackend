const express = require('express')
const router = express.Router();
const { validateUsername } = require('../middlewares/users')
const { validateAuthentication, isSuperAdmin } = require('../middlewares/auth')
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser
} = require('../services/users');

router.post('/', validateAuthentication, isSuperAdmin, validateUsername, createUser)

router.patch('/:id/activate', validateAuthentication, isSuperAdmin, activateUser)

router.patch('/:id/deactivate', validateAuthentication, isSuperAdmin, deactivateUser)

router.get('/:id', getUser)

router.get('/', getAllUsers)

router.delete('/:id', deleteUser)

router.put('/:id', updateUser)

module.exports = router;