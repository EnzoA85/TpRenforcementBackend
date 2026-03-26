const { Model, DataTypes } = require('sequelize')

const Request = (dbInstance, DataTypes) => {
    class Request extends Model {
        static associate(models) {
            this.belongsTo(models.Sinistre, { foreignKey: 'sinistre_id', as: 'Sinistre' })
            this.belongsTo(models.Document, { foreignKey: 'diagnostic_report_file', as: 'DiagnosticReport' })
            this.belongsTo(models.Document, { foreignKey: 'case1_contractor_invoice', as: 'ContractorInvoice' })
            this.belongsTo(models.Document, { foreignKey: 'case2_insured_rib', as: 'InsuredRib' })
            this.hasMany(models.History, { foreignKey: 'request_id', as: 'Histories' })
        }
    }

    Request.init(
        {
            sinistre_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Sinistre', key: 'id' }
            },
            status: {
                type: DataTypes.ENUM(
                    'initialized',
                    'expertise_requested',
                    'expertise_planned',
                    'expertise_done',
                    'intervention_to_plan',
                    'intervention_planned',
                    'vehicle_pickup_planned',
                    'vehicle_pickup_done',
                    'intervention_in_progress',
                    'vehicle_delivery_to_plan',
                    'vehicle_in_restitution',
                    'vehicle_restituted_invoice_pending',
                    'invoice_received_settlement_pending',
                    'settlement_done',
                    'compensation_estimate_pending',
                    'compensation_communicated',
                    'compensation_approved',
                    'vehicle_pickup_planned_nr',
                    'vehicle_pickup_done_compensation_pending',
                    'third_party_refacturation_pending',
                    'closed'
                ),
                allowNull: false,
                defaultValue: 'initialized'
            },
            // --- Expertise ---
            expertise_plan_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            expertise_effective_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            expertise_report_recieved: {
                type: DataTypes.DATE,
                allowNull: true
            },
            diagnostic: {
                type: DataTypes.ENUM('repairable', 'non_repairable'),
                allowNull: true
            },
            diagnostic_report_file: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Document', key: 'id' }
            },
            // --- Scénario 1 : véhicule réparable ---
            case1_date_of_service_plan: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_pickup_plan_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_pickup_effective_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_date_of_service_effective: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_end_date_of_service: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_return_date_plan: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_return_date_effective: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_contractor_invoice_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_contractor_invoice: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Document', key: 'id' }
            },
            case1_date_contractor_invoice_paid: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case1_third_party_invoice_paid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            // --- Scénario 2 : véhicule non réparable ---
            case2_estimated_compensation: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            case2_approved_compensation: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            case2_pickup_plan_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case2_insured_rib: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Document', key: 'id' }
            },
            case2_pickup_effective_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case2_compensation_payment_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            case2_third_party_invoice_paid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            closed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize: dbInstance,
            modelName: 'Request',
            tableName: 'Request',
            timestamps: false
        }
    )

    return Request;
}

module.exports = Request