var LocationModel = require('../models/LocationModel.js');

/**
* LocationController.js
*
* @description :: Server-side logic for managing locations.
*/
module.exports = {

  /**
  * LocationController.list()
  */
  list: function (req, res) {
    LocationModel.find({client: req.user.client}, function (err, locations) {
      if (err) {
        return res.json(500, {
          message: 'Error getting location.'
        });
      }
      return res.json(locations);
    });
  },

  /**
  * LocationController.show()
  */
  show: function (req, res) {
    var id = req.params.id;
    LocationModel.findOne({_id: id, client: req.user.client}, function (err, location) {
      if (err) {
        return res.json(500, {
          message: 'Error getting location.'
        });
      }
      if (!location) {
        return res.json(404, {
          message: 'No such location'
        });
      }
      return res.json(location);
    });
  },

  /**
  * LocationController.create()
  */
  create: function (req, res) {
    var location = new LocationModel({			address : req.body.address,			name : req.body.name,			city : req.body.city,			state : req.body.state,			zipcode : req.body.zipcode,			contact : req.body.contact,			phone : req.body.phone,
      client: req.user.client,
      note: req.body.note
    });

    location.save(function (err, location) {
      if (err) {
        return res.json(500, {
          message: 'Error saving location',
          error: err
        });
      }
      return res.json(location);
    });
  },

  /**
  * LocationController.update()
  */
  update: function (req, res) {
    var id = req.params.id;
    LocationModel.findOne({_id: id}, function (err, location) {
      if (err) {
        return res.json(500, {
          message: 'Error saving location',
          error: err
        });
      }
      if (!location) {
        return res.json(404, {
          message: 'No such location'
        });
      }

      const attrs = [
        'address',
        'name',
        'city',
        'state',
        'zipcode',
        'contact',
        'phone',
        'note'
      ];

      attrs.forEach(attr => {
        location[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : location[attr];
      });

      location.save(function (err, location) {
        if (err) {
          return res.json(500, {
            message: 'Error getting location.'
          });
        }
        if (!location) {
          return res.json(404, {
            message: 'No such location'
          });
        }
        return res.json(location);
      });
    });
  },

  /**
  * LocationController.remove()
  */
  remove: function (req, res) {
    var id = req.params.id;
    LocationModel.find({_id: id, client: req.user.client}, function (err, location) {
      if (err) {
        return res.json(500, {
          message: 'Error getting location.'
        });
      }
      return res.json(location);
    });
  }
};
