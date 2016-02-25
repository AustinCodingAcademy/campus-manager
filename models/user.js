'use strict';
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      toJSON: function () {
        var privateAttributes = [ 'password' ];
        return _.omit(this.dataValues, privateAttributes);
      }
    }
  });
  return User;
};
