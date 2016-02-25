'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      max_seats: {
        type: Sequelize.INTEGER
      },
      session_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      client_id: {
        type: Sequelize.INTEGER
      }
    });
    
    queryInterface.addIndex(
      'courses',
      ['session_id'],
      {
        indexName: 'session_id_index',
        indicesType: 'UNIQUE'
      }
    );
    
    return;
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('courses');
  }
};
