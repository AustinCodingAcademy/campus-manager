'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      start_date: {
        type: Sequelize.DATEONLY
      },
      end_date: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    queryInterface.addIndex(
      'courses',
      ['client_id'],
      {
        indexName: 'client_id_index',
        indicesType: 'UNIQUE'
      }
    );
    
    return;
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('sessions');
  }
};
