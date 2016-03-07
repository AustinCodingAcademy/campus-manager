var userModel = require('../models/userModel.js');
var _ = require('lodash');

/**
* userController.js
*
* @description :: Server-side logic for managing users.
*/
module.exports = {
  
  /**
  * userController.list()
  */
  list: function(req, res) {
    userModel.find(function(err, users){
      if(err) {
        return res.json(500, {
          message: 'Error getting user.'
        });
      }
      return res.json(users);
    });
  },
  
  /**
  * userController.show()
  */
  show: function(req, res) {
    var id = req.params.id;
    userModel.findOne({_id: id}, function(err, user){
      if(err) {
        return res.json(500, {
          message: 'Error getting user.'
        });
      }
      if(!user) {
        return res.json(404, {
          message: 'No such user'
        });
      }
      return res.json(user);
    });
  },
  
  /**
  * userController.create()
  */
  create: function(req, res) {
    var user = new userModel();        var attributes = [      'idn',      'username',      'first_name',      'last_name',      'email',      'phone',      'website',      'github',      'is_admin',      'is_instructor',      'is_student'    ];        _.each(attributes, function(attr) {      user[attr] =  req.body[attr] ? req.body[attr] : user[attr];    });        userModel.findOne({ _id: req.user.id }).populate('client').exec(function(err, currentUser) {       user.client = currentUser.client.id;      user.save(function(err, user){        if(err) {          return res.json(500, {            message: 'Error saving user',            error: err          });        }        return res.json({          message: 'saved',          _id: user._id        });      });    });  },
  
  /**
  * userController.update()
  */
  update: function(req, res) {
    var id = req.params.id;
    userModel.findOne({_id: id}, function(err, user){
      if(err) {
        return res.json(500, {
          message: 'Error saving user',
          error: err
        });
      }
      if(!user) {
        return res.json(404, {
          message: 'No such user'
        });
      }
      
      var attributes = [
        'idn',
        'username',
        'first_name',
        'last_name',
        'email',
        'phone',
        'website',
        'github',
        'is_admin',
        'is_instructor',
        'is_student'
      ];
      
      _.each(attributes, function(attr) {
        user[attr] =  req.body[attr] ? req.body[attr] : user[attr];
      });
          user.save(function(err, user){
        if(err) {
          return res.json(500, {
            message: 'Error getting user.'
          });
        }
        if(!user) {
          return res.json(404, {
            message: 'No such user'
          });
        }
        return res.json(user);
      });
    });
  },
  
  /**
  * userController.remove()
  */
  remove: function(req, res) {
    var id = req.params.id;
    userModel.findByIdAndRemove(id, function(err, user){
      if(err) {
        return res.json(500, {
          message: 'Error getting user.'
        });
      }
      return res.json(user);
    });
  }
};
