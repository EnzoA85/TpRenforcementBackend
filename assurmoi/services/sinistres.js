const { Op } = require('sequelize');
const { Sinistre, Request, Document, History, dbInstance } = require('../models')

const getAllSinistres = async (req, res) => {
    let queryParam = {};
    
    // Si l'utilisateur est authentifié et a le rôle 'insured', on filtre par user_id
    if (req.user && req.user.role === 'insured') {
        queryParam.where = {
            user_id: req.user.id
        };
    }
    
    if (req.query?.search) {
        if (!queryParam.where) {
            queryParam.where = {};
        }
        queryParam.where.plate = {
            [Op.like]: `%${req.query.search}%`
        };
    }
    
    const sinistres = await Sinistre.findAll(queryParam);
    res.status(200).json({
        sinistres
    })
}

const getSinistre = async (req, res) => {
    const id = req.params.id;
    const sinistre = await Sinistre.findOne({
        where: { id }
    })
    res.status(200).json({
        sinistre
    })
}

const createSinistre = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const {
            plate,
            driver_firstname,
            driver_lastname,
            driver_is_insured,
            call_datetime,
            sinister_datetime,
            context,
            driver_responsability,
            driver_engaged_responsability,
            cni_driver,
            vehicule_registration_certificate,
            insurance_certificate
        } = req.body

        // Si le conducteur n'est pas responsable, le taux est automatiquement 0
        const engagedResponsability = driver_responsability
            ? (driver_engaged_responsability ?? 50)
            : 0

        const sinistre = await Sinistre.create({
            plate,
            driver_firstname,
            driver_lastname,
            driver_is_insured,
            call_datetime,
            sinister_datetime,
            context,
            driver_responsability,
            driver_engaged_responsability: engagedResponsability,
            cni_driver,
            vehicule_registration_certificate,
            insurance_certificate,
            validated: false,
            user_id: req.user.id
        }, { transaction })

        transaction.commit();
        return res.status(201).json({
            sinistre
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on sinistre creation',
            stacktrace: err.errors
        })
    }
}

const updateSinistre = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const {
            plate,
            driver_firstname,
            driver_lastname,
            driver_is_insured,
            call_datetime,
            sinister_datetime,
            context,
            driver_responsability,
            driver_engaged_responsability,
            cni_driver,
            vehicule_registration_certificate,
            insurance_certificate,
            validated
        } = req.body

        const sinistre_id = req.params.id

        const sinistre = await Sinistre.update({
            plate,
            driver_firstname,
            driver_lastname,
            driver_is_insured,
            call_datetime,
            sinister_datetime,
            context,
            driver_responsability,
            driver_engaged_responsability,
            cni_driver,
            vehicule_registration_certificate,
            insurance_certificate,
            validated
        }, {
            where: { id: sinistre_id },
            transaction
        })

        transaction.commit();
        return res.status(200).json({
            message: 'Successfuly updated',
            sinistre
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on sinistre update',
            stacktrace: err.errors
        })
    }
}

const deleteSinistre = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const sinistre_id = req.params.id

        const status = await Sinistre.destroy({
            where: { id: sinistre_id },
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
            message: 'Error on sinistre deletion',
            stacktrace: err.errors
        })
    }
}

/**
 * Valide un sinistre (gestionnaire de portefeuille / admin).
 * Vérifie que l'attestation d'assurance est validée,
 * puis passe validated = true et crée automatiquement le dossier de prise en charge.
 */
const approveSinistre = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const sinistre_id = req.params.id;

        const sinistre = await Sinistre.findOne({
            where: { id: sinistre_id },
            include: [
                { model: Document, as: 'InsuranceCertificate' }
            ]
        });

        if (!sinistre) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Sinistre not found' });
        }

        if (sinistre.validated) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Sinistre is already validated' });
        }

        // L'attestation d'assurance doit exister et être validée
        if (!sinistre.InsuranceCertificate || !sinistre.InsuranceCertificate.validated) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Insurance certificate must be validated before approving the sinistre' });
        }

        // Vérifier qu'un dossier n'existe pas déjà
        const existingRequest = await Request.findOne({ where: { sinistre_id } });
        if (existingRequest) {
            await transaction.rollback();
            return res.status(400).json({ message: 'A request already exists for this sinistre' });
        }

        await Sinistre.update({ validated: true }, { where: { id: sinistre_id }, transaction });

        const newRequest = await Request.create({
            sinistre_id: parseInt(sinistre_id),
            status: 'initialized'
        }, { transaction });

        await History.create({
            sinistre_id: parseInt(sinistre_id),
            request_id: newRequest.id,
            user_id: req.user.id,
            update_details: 'Sinistre validated – dossier de prise en charge created',
            createdAt: new Date()
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            message: 'Sinistre validated and request created',
            request: newRequest
        });
    } catch (err) {
        await transaction.rollback();
        return res.status(400).json({
            message: 'Error on sinistre validation',
            stacktrace: err.errors ?? err.message
        });
    }
}

/**
 * Récupère le dossier de prise en charge associé à un sinistre.
 */
const getSinistreRequest = async (req, res) => {
    const sinistre_id = req.params.id;
    const request = await Request.findOne({
        where: { sinistre_id },
        include: [
            { model: Sinistre, as: 'Sinistre' },
            { model: Document, as: 'DiagnosticReport' },
            { model: Document, as: 'ContractorInvoice' },
            { model: Document, as: 'InsuredRib' }
        ]
    });

    if (!request) return res.status(404).json({ message: 'No request found for this sinistre' });

    return res.status(200).json({ request });
}

module.exports = {
    getAllSinistres,
    getSinistre,
    createSinistre,
    updateSinistre,
    deleteSinistre,
    approveSinistre,
    getSinistreRequest
}
