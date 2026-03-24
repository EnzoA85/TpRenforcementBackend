'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User', [
      {
        username: 'enzoa',
        password: 'password',
        firstname: 'Enzo',
        lastname: 'ARCHAMBAUD',
        email: 'bib.enzoarchambaud@gmail.com'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', { username: 'saittirite' })
  }
};