'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Request', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        sinistre_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Sinistre', key: 'id' }
        },
        status: {
          type: Sequelize.ENUM(
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
          type: Sequelize.DATE,
          allowNull: true
        },
        expertise_effective_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        expertise_report_recieved: {
          type: Sequelize.DATE,
          allowNull: true
        },
        diagnostic: {
          type: Sequelize.ENUM('repairable', 'non_repairable'),
          allowNull: true
        },
        diagnostic_report_file: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Document', key: 'id' }
        },
        // --- Scénario 1 : véhicule réparable ---
        case1_date_of_service_plan: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_pickup_plan_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_pickup_effective_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_date_of_service_effective: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_end_date_of_service: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_return_date_plan: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_return_date_effective: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_contractor_invoice_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_contractor_invoice: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Document', key: 'id' }
        },
        case1_date_contractor_invoice_paid: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case1_third_party_invoice_paid: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        // --- Scénario 2 : véhicule non réparable ---
        case2_estimated_compensation: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        case2_approved_compensation: {
          type: Sequelize.BOOLEAN,
          allowNull: true
        },
        case2_pickup_plan_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case2_insured_rib: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Document', key: 'id' }
        },
        case2_pickup_effective_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case2_compensation_payment_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        case2_third_party_invoice_paid: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        closed: {
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
      await queryInterface.dropTable('Request', { transaction });
      transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  }
};

