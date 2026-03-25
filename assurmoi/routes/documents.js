const express = require('express')
const router = express.Router();
const {
    getAllDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentSinistres
} = require('../services/documents');

router.post('/', createDocument)

router.get('/:id/sinistres', getDocumentSinistres)

router.get('/:id', getDocument)

router.get('/', getAllDocuments)

router.delete('/:id', deleteDocument)

router.put('/:id', updateDocument)

module.exports = router;
