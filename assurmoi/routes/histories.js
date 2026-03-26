const express = require('express')
const router = express.Router();
const {
    getAllHistories,
    getHistory,
    createHistory,
    deleteHistory
} = require('../services/histories');

router.post('/', createHistory)

router.get('/:id', getHistory)

router.get('/', getAllHistories)

router.delete('/:id', deleteHistory)

module.exports = router;
