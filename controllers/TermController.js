var TermModel = require('../models/TermModel.js');
var CourseModel = require('../models/CourseModel.js');
var UserModel = require('../models/UserModel.js');
var _ = require('underscore');
var reversePopulate = require('mongoose-reverse-populate');

/**
* TermController.js
*
* @description :: Server-side logic for managing terms.
*/
module.exports = {

  /**
  * TermController.list()
  */
  list: function(req, res) {
    TermModel.find({
      client: req.user.client
    }, null, function(err, terms){
      if(err) {
        return res.json(500, {
          message: 'Error getting term.'
        });
      }
    	reversePopulate({
        modelArray: terms,
        storeWhere: "courses",
        arrayPop: true,
        mongooseModel: CourseModel,
        idField: "term"
      }, function(err, terms) {
    		return res.json(terms);
    	});
    });
  },

  /**
  * TermController.show()
  */
  show: function(req, res) {
    var id = req.params.id;
    TermModel.findOne({
      _id: id,
      client: req.user.client
    }, function(err, term){
      if(err) {
        return res.json(500, {
          message: 'Error getting term.'
        });
      }
      if(!term) {
        return res.json(404, {
          message: 'No such term'
        });
      }
      return res.json(term);
    });
  },

  /**
  * TermController.create()
  */
  create: function(req, res) {
    var term = new TermModel({      start_date : req.body.start_date,      end_date : req.body.end_date,      name : req.body.name    });

    UserModel.findOne({
      _id: req.user.id
    }).populate('client').exec(function(err, currentUser) {
      term.client = currentUser.client.id;
      term.save(function(err, term){
        if(err) {
          return res.json(500, {
            message: 'Error saving term',
            error: err
          });
        }
        return res.json({
          message: 'saved',
          _id: term._id
        });
      });
    });
  },

  /**
  * TermController.update()
  */
  update: function(req, res) {
    var id = req.params.id;
    TermModel.findOne({
      _id: id,
      client: req.user.client
    }, function(err, term){
      if(err) {
        return res.json(500, {
          message: 'Error saving term',
          error: err
        });
      }
      if(!term) {
        return res.json(404, {
          message: 'No such term'
        });
      }

      term.start_date =  req.body.start_date ? req.body.start_date : term.start_date;      term.end_date =  req.body.end_date ? req.body.end_date : term.end_date;      term.name =  req.body.name ? req.body.name : term.name;      term.client =  req.body.client ? req.body.client : term.client;
      term.save(function(err, term){
        if(err) {
          return res.json(500, {
            message: 'Error getting term.'
          });
        }
        if(!term) {
          return res.json(404, {
            message: 'No such term'
          });
        }
        return res.json(term);
      });
    });
  },

  /**
  * TermController.remove()
  */
  remove: function(req, res) {
    var id = req.params.id;
    TermModel.remove({
      _id: id,
      client: req.user.client
    }, function(err, term){
      if(err) {
        return res.json(500, {
          message: 'Error getting term.'
        });
      }
      return res.json(term);
    });
  }
};
