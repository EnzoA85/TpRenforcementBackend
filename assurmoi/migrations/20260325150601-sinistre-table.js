'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Sinistre', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        plate: {
          type: Sequelize.STRING,
          allowNull: false
        },
        driver_firstname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        driver_lastname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        driver_is_insured: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        call_datetime: {
          type: Sequelize.DATE,
          allowNull: false
        },
        sinister_datetime: {
          type: Sequelize.DATE,
          allowNull: false
        },
        context: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        driver_responsability: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        driver_engaged_responsability: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        cni_driver: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Document', key: 'id' }
        },
        vehicule_registration_certificate: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Document', key: 'id' }
        },
        insurance_certificate: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Document', key: 'id' }
        },
        validated: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      }, { transaction });
      transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('Sinistre', { transaction });
      transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  }
};
