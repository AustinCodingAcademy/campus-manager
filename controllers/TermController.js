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
    }, null, {
      sort: 'start_date'
    }, function(err, terms){
      if(err) {
        return res.json(500, {
          message: 'Error getting term.',
          error: err
        });
      }
    	reversePopulate({
        modelArray: terms,
        storeWhere: "courses",
        arrayPop: true,
        mongooseModel: CourseModel,
        idField: "term",
        populate: [{ path: 'registrations', select: 'id' }, { path: 'location' }]
      }, function(err, terms) {
        var sorted = _.sortBy(terms, 'start_date');
        return res.json(sorted.reverse());
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
          message: 'Error getting term.',
          error: err
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
    }, function(err, currentUser) {
      term.client = req.user.client;
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

      const attrs = [
        'start_date',
        'end_date',
        'name'
      ];

      attrs.forEach(attr => {
        term[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : term[attr];
      });

      term.save(function(err, term){
        if(err) {
          return res.json(500, {
            message: 'Error getting term.',
            error: err
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
          message: 'Error getting term.',
          error: err
        });
      }
      return res.json(term);
    });
  }
};
