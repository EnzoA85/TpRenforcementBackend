const { Request, Sinistre, Document, History, dbInstance } = require('../models')

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

/**
 * Fait progresser un dossier de prise en charge à l'étape suivante.
 *
 * Chaque étape impose des champs obligatoires dans le body.
 * La route vérifie le statut actuel, valide les prérequis, met à jour le dossier
 * et crée une entrée d'historique.
 *
 * Scénario 1 (diagnostic = 'repairable') :
 *   initialized → expertise_requested → expertise_planned → expertise_done
 *   → intervention_to_plan → intervention_planned → vehicle_pickup_planned
 *   → vehicle_pickup_done → intervention_in_progress → vehicle_delivery_to_plan
 *   → vehicle_in_restitution → vehicle_restituted_invoice_pending
 *   → invoice_received_settlement_pending → settlement_done
 *   → [100%] closed | [50%/0%] third_party_refacturation_pending → closed
 *
 * Scénario 2 (diagnostic = 'non_repairable') :
 *   expertise_done → compensation_estimate_pending → compensation_communicated
 *   → compensation_approved → vehicle_pickup_planned_nr
 *   → vehicle_pickup_done_compensation_pending → settlement_done
 *   → [100%] closed | [50%/0%] third_party_refacturation_pending → closed
 */
const advanceRequest = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const request_id = req.params.id;

        const request = await Request.findOne({
            where: { id: request_id },
            include: [{ model: Sinistre, as: 'Sinistre' }]
        });

        if (!request) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.closed || request.status === 'closed') {
            await transaction.rollback();
            return res.status(400).json({ message: 'Dossier is already closed' });
        }

        const currentStatus = request.status;
        const sinistre = request.Sinistre;
        const updates = {};
        let newStatus;

        const missing = (field) => res.status(400).json({ message: `'${field}' is required to advance from '${currentStatus}'` });

        switch (currentStatus) {

            // --- Phase commune ---
            case 'initialized':
                if (!req.body.expertise_plan_date) return missing('expertise_plan_date');
                updates.expertise_plan_date = req.body.expertise_plan_date;
                newStatus = 'expertise_requested';
                break;

            case 'expertise_requested':
                if (!req.body.expertise_effective_date) return missing('expertise_effective_date');
                updates.expertise_effective_date = req.body.expertise_effective_date;
                newStatus = 'expertise_planned';
                break;

            case 'expertise_planned': {
                const { expertise_report_recieved, diagnostic, diagnostic_report_file } = req.body;
                if (!expertise_report_recieved) return missing('expertise_report_recieved');
                if (!diagnostic) return missing('diagnostic');
                if (!diagnostic_report_file) return missing('diagnostic_report_file');
                if (!['repairable', 'non_repairable'].includes(diagnostic)) {
                    await transaction.rollback();
                    return res.status(400).json({ message: "'diagnostic' must be 'repairable' or 'non_repairable'" });
                }
                const reportDoc = await Document.findByPk(diagnostic_report_file);
                if (!reportDoc || !reportDoc.validated) {
                    await transaction.rollback();
                    return res.status(400).json({ message: 'The diagnostic report document must be validated by a manager first' });
                }
                updates.expertise_report_recieved = expertise_report_recieved;
                updates.diagnostic = diagnostic;
                updates.diagnostic_report_file = diagnostic_report_file;
                newStatus = 'expertise_done';
                break;
            }

            // --- Bifurcation après expertise ---
            case 'expertise_done':
                if (request.diagnostic === 'repairable') {
                    if (!req.body.case1_date_of_service_plan) return missing('case1_date_of_service_plan');
                    updates.case1_date_of_service_plan = req.body.case1_date_of_service_plan;
                    newStatus = 'intervention_to_plan';
                } else {
                    if (!req.body.case2_estimated_compensation) return missing('case2_estimated_compensation');
                    updates.case2_estimated_compensation = req.body.case2_estimated_compensation;
                    newStatus = 'compensation_estimate_pending';
                }
                break;

            // --- Scénario 1 : véhicule réparable ---
            case 'intervention_to_plan':
                if (!req.body.case1_pickup_plan_date) return missing('case1_pickup_plan_date');
                updates.case1_pickup_plan_date = req.body.case1_pickup_plan_date;
                newStatus = 'intervention_planned';
                break;

            case 'intervention_planned':
                if (!req.body.case1_pickup_effective_date) return missing('case1_pickup_effective_date');
                updates.case1_pickup_effective_date = req.body.case1_pickup_effective_date;
                newStatus = 'vehicle_pickup_planned';
                break;

            case 'vehicle_pickup_planned':
                if (!req.body.case1_date_of_service_effective) return missing('case1_date_of_service_effective');
                updates.case1_date_of_service_effective = req.body.case1_date_of_service_effective;
                newStatus = 'vehicle_pickup_done';
                break;

            case 'vehicle_pickup_done':
                if (!req.body.case1_end_date_of_service) return missing('case1_end_date_of_service');
                updates.case1_end_date_of_service = req.body.case1_end_date_of_service;
                newStatus = 'intervention_in_progress';
                break;

            case 'intervention_in_progress':
                if (!req.body.case1_return_date_plan) return missing('case1_return_date_plan');
                updates.case1_return_date_plan = req.body.case1_return_date_plan;
                newStatus = 'vehicle_delivery_to_plan';
                break;

            case 'vehicle_delivery_to_plan':
                if (!req.body.case1_return_date_effective) return missing('case1_return_date_effective');
                updates.case1_return_date_effective = req.body.case1_return_date_effective;
                newStatus = 'vehicle_in_restitution';
                break;

            case 'vehicle_in_restitution': {
                const { case1_contractor_invoice_date, case1_contractor_invoice } = req.body;
                if (!case1_contractor_invoice_date) return missing('case1_contractor_invoice_date');
                if (!case1_contractor_invoice) return missing('case1_contractor_invoice');
                updates.case1_contractor_invoice_date = case1_contractor_invoice_date;
                updates.case1_contractor_invoice = case1_contractor_invoice;
                newStatus = 'vehicle_restituted_invoice_pending';
                break;
            }

            case 'vehicle_restituted_invoice_pending':
                if (!req.body.case1_date_contractor_invoice_paid) return missing('case1_date_contractor_invoice_paid');
                updates.case1_date_contractor_invoice_paid = req.body.case1_date_contractor_invoice_paid;
                newStatus = 'invoice_received_settlement_pending';
                break;

            case 'invoice_received_settlement_pending':
                newStatus = 'settlement_done';
                break;

            // --- Scénario 2 : véhicule non-réparable ---
            case 'compensation_estimate_pending':
                if (req.body.case2_approved_compensation === undefined) return missing('case2_approved_compensation');
                updates.case2_approved_compensation = req.body.case2_approved_compensation;
                newStatus = 'compensation_communicated';
                break;

            case 'compensation_communicated': {
                const { case2_pickup_plan_date, case2_insured_rib } = req.body;
                if (!case2_pickup_plan_date) return missing('case2_pickup_plan_date');
                if (!case2_insured_rib) return missing('case2_insured_rib');
                updates.case2_pickup_plan_date = case2_pickup_plan_date;
                updates.case2_insured_rib = case2_insured_rib;
                newStatus = 'compensation_approved';
                break;
            }

            case 'compensation_approved':
                if (!req.body.case2_pickup_effective_date) return missing('case2_pickup_effective_date');
                updates.case2_pickup_effective_date = req.body.case2_pickup_effective_date;
                newStatus = 'vehicle_pickup_planned_nr';
                break;

            case 'vehicle_pickup_planned_nr':
                if (!req.body.case2_compensation_payment_date) return missing('case2_compensation_payment_date');
                updates.case2_compensation_payment_date = req.body.case2_compensation_payment_date;
                newStatus = 'vehicle_pickup_done_compensation_pending';
                break;

            case 'vehicle_pickup_done_compensation_pending':
                newStatus = 'settlement_done';
                break;

            // --- Clôture commune aux deux scénarios ---
            case 'settlement_done': {
                const responsabilityRate = sinistre.driver_engaged_responsability;
                if (responsabilityRate === 100) {
                    updates.closed = true;
                    newStatus = 'closed';
                } else {
                    newStatus = 'third_party_refacturation_pending';
                }
                break;
            }

            case 'third_party_refacturation_pending':
                if (request.diagnostic === 'repairable') {
                    if (!req.body.case1_third_party_invoice_paid) return missing('case1_third_party_invoice_paid');
                    updates.case1_third_party_invoice_paid = true;
                } else {
                    if (!req.body.case2_third_party_invoice_paid) return missing('case2_third_party_invoice_paid');
                    updates.case2_third_party_invoice_paid = true;
                }
                updates.closed = true;
                newStatus = 'closed';
                break;

            default:
                await transaction.rollback();
                return res.status(400).json({ message: `Cannot advance from status '${currentStatus}'` });
        }

        updates.status = newStatus;

        await Request.update(updates, { where: { id: request_id }, transaction });

        await History.create({
            request_id: parseInt(request_id),
            user_id: req.user.id,
            update_details: `Status changed from '${currentStatus}' to '${newStatus}'`,
            createdAt: new Date()
        }, { transaction });

        await transaction.commit();

        const updatedRequest = await Request.findOne({
            where: { id: request_id },
            include: [
                { model: Sinistre, as: 'Sinistre' },
                { model: Document, as: 'DiagnosticReport' },
                { model: Document, as: 'ContractorInvoice' },
                { model: Document, as: 'InsuredRib' }
            ]
        });

        return res.status(200).json({ request: updatedRequest });

    } catch (err) {
        await transaction.rollback();
        return res.status(400).json({
            message: 'Error on request advance',
            stacktrace: err.errors ?? err.message
        });
    }
}

module.exports = {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest,
    advanceRequest
}