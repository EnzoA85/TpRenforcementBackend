const { Model, DataTypes } = require('sequelize')

const History = (dbInstance, DataTypes) => {
    class History extends Model {
        static associate(models) {
            this.belongsTo(models.Request, { foreignKey: 'request_id', as: 'Request' })
            this.belongsTo(models.Sinistre, { foreignKey: 'sinistre_id', as: 'Sinistre' })
            this.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' })
        }
    }

    History.init(
        {
            request_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Request', key: 'id' }
            },
            sinistre_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Sinistre', key: 'id' }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'User', key: 'id' }
            },
            update_details: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            sequelize: dbInstance,
            modelName: 'History',
            tableName: 'History',
            timestamps: false
        }
    )

    return History;
}

module.exports = History
