var userModel = require('../models/userModel.js');

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
    var user = new userModel({      username : req.body.username,      password : req.body.password
    });
    
    user.save(function(err, user){
      if(err) {
        return res.json(500, {
          message: 'Error saving user',
          error: err
        });
      }
      return res.json({
        message: 'saved',
        _id: user._id
      });
    });
  },
  
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
      
      user.username =  req.body.username ? req.body.username : user.username;      user.password =  req.body.password ? req.body.password : user.password;      
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
