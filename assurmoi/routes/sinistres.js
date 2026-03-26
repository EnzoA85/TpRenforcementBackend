const express = require('express')
const router = express.Router();
const { validateSinistre } = require('../middlewares/sinistres')
const { validateAuthentication, isManagerOrAdmin } = require('../middlewares/auth')
const {
    getAllSinistres,
    getSinistre,
    createSinistre,
    updateSinistre,
    deleteSinistre,
    approveSinistre,
    getSinistreRequest
} = require('../services/sinistres');

router.post('/', validateSinistre, createSinistre)

router.get('/:id/request', validateAuthentication, getSinistreRequest)

router.patch('/:id/validate', validateAuthentication, isManagerOrAdmin, approveSinistre)

router.get('/:id', getSinistre)

router.get('/', getAllSinistres)

router.delete('/:id', deleteSinistre)

router.put('/:id', updateSinistre)

module.exports = router;
