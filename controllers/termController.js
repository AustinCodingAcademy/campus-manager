var termModel = require('../models/termModel.js');

/**
* termController.js
*
* @description :: Server-side logic for managing terms.
*/
module.exports = {
  
  /**
  * termController.list()
  */
  list: function(req, res) {
    termModel.find(function(err, terms){
      if(err) {
        return res.json(500, {
          message: 'Error getting term.'
        });
      }
      return res.json(terms);
    });
  },
  
  /**
  * termController.show()
  */
  show: function(req, res) {
    var id = req.params.id;
    termModel.findOne({_id: id}, function(err, term){
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
  * termController.create()
  */
  create: function(req, res) {
    var term = new termModel({      start_date : req.body.start_date,      end_date : req.body.end_date,      name : req.body.name,      client : req.body.client
    });
    
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
  },
  
  /**
  * termController.update()
  */
  update: function(req, res) {
    var id = req.params.id;
    termModel.findOne({_id: id}, function(err, term){
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
  * termController.remove()
  */
  remove: function(req, res) {
    var id = req.params.id;
    termModel.findByIdAndRemove(id, function(err, term){
      if(err) {
        return res.json(500, {
          message: 'Error getting term.'
        });
      }
      return res.json(term);
    });
  }
};
