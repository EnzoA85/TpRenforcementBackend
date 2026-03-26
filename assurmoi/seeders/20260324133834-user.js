'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedpassword = await bcrypt.hash('password', 10)
    await queryInterface.bulkInsert('User', [
      {
        username: 'enzoa',
        password: hashedpassword,
        firstname: 'Enzo',
        lastname: 'ARCHAMBAUD',
        email: 'bib.enzoarchambaud@gmail.com',
        role: 'superadmin'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', { username: 'enzoa' })
  }
};