const express = require('express')
const router = express.Router();
const { validateAuthentication, isManagerOrAdmin } = require('../middlewares/auth')
const {
    getAllDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentSinistres,
    validateDocument
} = require('../services/documents');

router.post('/', createDocument)

router.patch('/:id/validate', validateAuthentication, isManagerOrAdmin, validateDocument)

router.get('/:id/sinistres', getDocumentSinistres)

router.get('/:id', getDocument)

router.get('/', getAllDocuments)

router.delete('/:id', deleteDocument)

router.put('/:id', updateDocument)

module.exports = router;
