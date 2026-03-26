const { Model, DataTypes, Sequelize } = require('sequelize')

const User = (dbInstance, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.hasMany(models.History, { foreignKey: 'user_id', as: 'Histories' })
        }
    }

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: DataTypes.STRING,
            role: {
                type: DataTypes.ENUM('superadmin', 'manager', 'sinister_manager', 'request_manager', 'insured'),
                allowNull: false,
                defaultValue: 'insured'
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true
            },
            refresh_token: {
                type: Sequelize.STRING,
                allowNull: true
            },
            two_step_code: {
                type: Sequelize.STRING,
                allowNull: true
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            sequelize: dbInstance,
            modelName: 'User',
            tableName: 'User',
            timestamps: false
        }
    )

    return User;
}

module.exports = User