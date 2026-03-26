const express = require('express')
const router = express.Router();
const {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest
} = require('../services/requests');

router.post('/', createRequest)

router.get('/:id', getRequest)

router.get('/', getAllRequests)

router.delete('/:id', deleteRequest)

router.put('/:id', updateRequest)

module.exports = router;
