const express = require('express');

const {
    getQueriesList,
    newQuerie,
    updateQuerieStatus,
    deleteQuerieById,
    deleteAllCompleted
} = require('../services/ocrService');

const ocrRouter = express.Router();

ocrRouter.get('/:uid', getQueriesList);
ocrRouter.post('/new', newQuerie);
ocrRouter.put('/:tid', updateQuerieStatus);
ocrRouter.delete('/:tid', deleteQuerieById);
ocrRouter.delete('/completed/true', deleteAllCompleted);

module.exports = ocrRouter;