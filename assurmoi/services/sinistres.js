const { Op } = require('sequelize');
const { Sinistre, dbInstance } = require('../models')

const getAllSinistres = async (req, res) => {
    let queryParam = {};
    if (req.query?.search) {
        queryParam = {
            where: {
                plate: {
                    [Op.like]: `%${req.query.search}%`
                }
            }
        }
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
            validated: false
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

module.exports = {
    getAllSinistres,
    getSinistre,
    createSinistre,
    updateSinistre,
    deleteSinistre
}
