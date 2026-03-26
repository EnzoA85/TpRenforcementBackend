'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('History', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        request_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Request', key: 'id' }
        },
        sinistre_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Sinistre', key: 'id' }
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'User', key: 'id' }
        },
        update_details: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
      await queryInterface.dropTable('History', { transaction });
      transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  }
};
