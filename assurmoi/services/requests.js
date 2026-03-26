const { Request, Sinistre, Document, dbInstance } = require('../models')

const getAllRequests = async (req, res) => {
    let queryParam = {
        include: [
            { model: Sinistre, as: 'Sinistre' },
            { model: Document, as: 'DiagnosticReport' },
            { model: Document, as: 'ContractorInvoice' },
            { model: Document, as: 'InsuredRib' }
        ]
    };
    if (req.query?.status) {
        queryParam.where = { status: req.query.status }
    }
    const requests = await Request.findAll(queryParam);
    res.status(200).json({
        requests
    })
}

const getRequest = async (req, res) => {
    const id = req.params.id;
    const request = await Request.findOne({
        where: { id },
        include: [
            { model: Sinistre, as: 'Sinistre' },
            { model: Document, as: 'DiagnosticReport' },
            { model: Document, as: 'ContractorInvoice' },
            { model: Document, as: 'InsuredRib' }
        ]
    })
    res.status(200).json({
        request
    })
}

const createRequest = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { sinistre_id } = req.body

        const request = await Request.create({
            sinistre_id,
            status: 'initialized'
        }, { transaction })

        transaction.commit();
        return res.status(201).json({
            request
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on request creation',
            stacktrace: err.errors
        })
    }
}

const updateRequest = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const {
            status,
            expertise_plan_date,
            expertise_effective_date,
            expertise_report_recieved,
            diagnostic,
            diagnostic_report_file,
            case1_date_of_service_plan,
            case1_pickup_plan_date,
            case1_pickup_effective_date,
            case1_date_of_service_effective,
            case1_end_date_of_service,
            case1_return_date_plan,
            case1_return_date_effective,
            case1_contractor_invoice_date,
            case1_contractor_invoice,
            case1_date_contractor_invoice_paid,
            case1_third_party_invoice_paid,
            case2_estimated_compensation,
            case2_approved_compensation,
            case2_pickup_plan_date,
            case2_insured_rib,
            case2_pickup_effective_date,
            case2_compensation_payment_date,
            case2_third_party_invoice_paid,
            closed
        } = req.body

        const request_id = req.params.id

        const request = await Request.update({
            status,
            expertise_plan_date,
            expertise_effective_date,
            expertise_report_recieved,
            diagnostic,
            diagnostic_report_file,
            case1_date_of_service_plan,
            case1_pickup_plan_date,
            case1_pickup_effective_date,
            case1_date_of_service_effective,
            case1_end_date_of_service,
            case1_return_date_plan,
            case1_return_date_effective,
            case1_contractor_invoice_date,
            case1_contractor_invoice,
            case1_date_contractor_invoice_paid,
            case1_third_party_invoice_paid,
            case2_estimated_compensation,
            case2_approved_compensation,
            case2_pickup_plan_date,
            case2_insured_rib,
            case2_pickup_effective_date,
            case2_compensation_payment_date,
            case2_third_party_invoice_paid,
            closed
        }, {
            where: { id: request_id },
            transaction
        })

        transaction.commit();
        return res.status(200).json({
            message: 'Successfuly updated',
            request
        })
    } catch (err) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on request update',
            stacktrace: err.errors
        })
    }
}

const deleteRequest = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const request_id = req.params.id

        const status = await Request.destroy({
            where: { id: request_id },
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
            message: 'Error on request deletion',
            stacktrace: err.errors
        })
    }
}

module.exports = {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest
}