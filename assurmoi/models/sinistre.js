const { Model, DataTypes } = require('sequelize')

const Sinistre = (dbInstance, DataTypes) => {
    class Sinistre extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' })
            this.belongsTo(models.Document, { foreignKey: 'cni_driver', as: 'CniDriver' })
            this.belongsTo(models.Document, { foreignKey: 'vehicule_registration_certificate', as: 'VehiculeRegistrationCertificate' })
            this.belongsTo(models.Document, { foreignKey: 'insurance_certificate', as: 'InsuranceCertificate' })
            this.hasOne(models.Request, { foreignKey: 'sinistre_id', as: 'Request' })
            this.hasMany(models.History, { foreignKey: 'sinistre_id', as: 'Histories' })
        }
    }

    Sinistre.init(
        {
            plate: {
                type: DataTypes.STRING,
                allowNull: false
            },
            driver_firstname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            driver_lastname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            driver_is_insured: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            call_datetime: {
                type: DataTypes.DATE,
                allowNull: false
            },
            sinister_datetime: {
                type: DataTypes.DATE,
                allowNull: false
            },
            context: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            driver_responsability: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            driver_engaged_responsability: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            cni_driver: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Document', key: 'id' }
            },
            vehicule_registration_certificate: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Document', key: 'id' }
            },
            insurance_certificate: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Document', key: 'id' }
            },
            validated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'User', key: 'id' }
            }
        },
        {
            sequelize: dbInstance,
            modelName: 'Sinistre',
            tableName: 'Sinistre',
            timestamps: false
        }
    )

    return Sinistre;
}

module.exports = Sinistre
