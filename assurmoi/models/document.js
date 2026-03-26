const { Model, DataTypes } = require('sequelize')

const Document = (dbInstance, DataTypes) => {
    class Document extends Model {
        static associate(models) {
            this.hasMany(models.Sinistre, { foreignKey: 'cni_driver', as: 'SinistresCni' })
            this.hasMany(models.Sinistre, { foreignKey: 'vehicule_registration_certificate', as: 'SinistresVehiculeRegistration' })
            this.hasMany(models.Sinistre, { foreignKey: 'insurance_certificate', as: 'SinistresInsurance' })
            this.hasMany(models.Request, { foreignKey: 'diagnostic_report_file', as: 'RequestsDiagnosticReport' })
            this.hasMany(models.Request, { foreignKey: 'case1_contractor_invoice', as: 'RequestsContractorInvoice' })
            this.hasMany(models.Request, { foreignKey: 'case2_insured_rib', as: 'RequestsInsuredRib' })
        }
    }

    Document.init(
        {
            type: {
                type: DataTypes.ENUM(
                    'cni_driver',
                    'vehicule_registration_certificate',
                    'insurance_certificate',
                    'diagnostic_report',
                    'contractor_invoice',
                    'insured_rib'
                ),
                allowNull: false
            },
            path: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            validated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize: dbInstance,
            modelName: 'Document',
            tableName: 'Document',
            timestamps: false
        }
    )

    return Document;
}

module.exports = Document
