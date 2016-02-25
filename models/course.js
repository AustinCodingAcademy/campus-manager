'use strict';
module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('course', {
    name: DataTypes.STRING,
    max_seats: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Course;
};
