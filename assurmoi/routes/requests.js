const express = require('express')
const router = express.Router();
const { validateAuthentication, canManageRequests } = require('../middlewares/auth')
const {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest,
    advanceRequest
} = require('../services/requests');

router.post('/', createRequest)

router.post('/:id/advance', validateAuthentication, canManageRequests, advanceRequest)

router.get('/:id', getRequest)

router.get('/', getAllRequests)

router.delete('/:id', deleteRequest)

router.put('/:id', updateRequest)

module.exports = router;
