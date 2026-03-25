const express = require('express')
const router = express.Router();
const { validateSinistre } = require('../middlewares/sinistres')
const {
    getAllSinistres,
    getSinistre,
    createSinistre,
    updateSinistre,
    deleteSinistre
} = require('../services/sinistres');

router.post('/', validateSinistre, createSinistre)

router.get('/:id', getSinistre)

router.get('/', getAllSinistres)

router.delete('/:id', deleteSinistre)

router.put('/:id', updateSinistre)

module.exports = router;
