const { Document, Sinistre, dbInstance } = require('../models')

const getAllDocuments = async (req, res) => {
    const documents = await Document.findAll();
    res.status(200).json({
        documents
    })
}

const getDocument = async (req, res) => {
    const id = req.params.id;
    const document = await Document.findOne({
        where: { id }
    })
    res.status(200).json({
        document
    })
}

const createDocument = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { type, path, validated } = req.body

        const document = await Document.create({
            type,
            path,
            validated: validated ?? false
        }, { transaction })

        transaction.commit();
        return res.status(201).json({
            document
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on document creation',
            stacktrace: err.errors
        })
    }
}

const updateDocument = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { type, path, validated } = req.body
        const document_id = req.params.id

        const document = await Document.update({
            type,
            path,
            validated
        }, {
            where: { id: document_id },
            transaction
        })

        transaction.commit();
        return res.status(200).json({
            message: 'Successfuly updated',
            document
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on document update',
            stacktrace: err.errors
        })
    }
}

const deleteDocument = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const document_id = req.params.id

        const status = await Document.destroy({
            where: { id: document_id },
            transaction
        })

        transaction.commit();
        return res.status(200).json({
            message: 'Successfuly deleted',
            status
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on document deletion',
            stacktrace: err.errors
        })
    }
}

// Récupère tous les sinistres liés à un document
const getDocumentSinistres = async (req, res) => {
    const document_id = req.params.id;
    const sinistres = await Sinistre.findAll({
        where: {
            [require('sequelize').Op.or]: [
                { cni_driver: document_id },
                { vehicule_registration_certificate: document_id },
                { insurance_certificate: document_id }
            ]
        }
    })
    res.status(200).json({
        sinistres
    })
}

module.exports = {
    getAllDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentSinistres
}
