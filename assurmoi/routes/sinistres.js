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
    getSinistreRequest,
    setSinistreDocument,
    getAllSinistreDocument,
    getSinistreDocumentRequest
} = require('../services/sinistres');

router.post('/', validateSinistre, validateAuthentication, createSinistre)

router.get('/:id/request', validateAuthentication, getSinistreRequest)

router.patch('/:id/validate', validateAuthentication, isManagerOrAdmin, approveSinistre)

router.post('/:id/document', validateAuthentication, setSinistreDocument)

//router.get('/:id/document', validateAuthentication, getAllSinistreDocument)

//router.get('/:id/document/:id', validateAuthentication, getSinistreDocumentRequest)

router.get('/:id', getSinistre)

router.get('/', validateAuthentication, getAllSinistres)

router.delete('/:id', deleteSinistre)

router.put('/:id', updateSinistre)

module.exports = router;
