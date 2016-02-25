'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      github: {
        type: Sequelize.STRING
      },
      client: {
        type: Sequelize.BOOLEAN
      },
      admin: {
        type: Sequelize.BOOLEAN
      },
      instructor: {
        type: Sequelize.BOOLEAN
      },
      student: {
        type: Sequelize.BOOLEAN
      }
    });
    
    queryInterface.addIndex(
      'users',
      ['username'],
      {
        indexName: 'username_index',
        indicesType: 'UNIQUE'
      }
    );
    
    return;
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
