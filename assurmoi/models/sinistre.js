const { Model, DataTypes } = require('sequelize')

const Sinistre = (dbInstance, DataTypes) => {
    class Sinistre extends Model {
        // static associate(models) {
        //     this.belongsTo(models.Document, { foreignKey: 'cni_driver', as: 'CniDriver' })
        //     this.belongsTo(models.Document, { foreignKey: 'vehicule_registration_certificate', as: 'VehiculeRegistrationCertificate' })
        //     this.belongsTo(models.Document, { foreignKey: 'insurance_certificate', as: 'InsuranceCertificate' })
        // }
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
                allowNull: true
            },
            vehicule_registration_certificate: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            insurance_certificate: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            validated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
