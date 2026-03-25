'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Document', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        type: {
          type: Sequelize.ENUM('cni_driver', 'vehicule_registration_certificate', 'insurance_certificate'),
          allowNull: false
        },
        path: {
          type: Sequelize.TEXT,
          allowNull: false
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
      await queryInterface.dropTable('Document', { transaction });
      transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  }
};
