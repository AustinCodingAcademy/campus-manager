'use strict';
module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define('session', {
    name: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Session;
};
