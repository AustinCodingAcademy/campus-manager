var TrackModel = require('../models/TrackModel.js');

/**
* TrackController.js
*
* @description :: Server-side logic for managing tracks.
*/
module.exports = {

  /**
  * TrackController.list()
  */
  list: function (req, res) {
    TrackModel.find({client: req.user.client}, function (err, tracks) {
      if (err) {
        return res.json(500, {
          message: 'Error getting track.'
        });
      }
      return res.json(tracks);
    });
  },

  /**
  * TrackController.show()
  */
  show: function (req, res) {
    var id = req.params.id;
    TrackModel.findOne({_id: id, client: req.user.client}, function (err, track) {
      if (err) {
        return res.json(500, {
          message: 'Error getting track.'
        });
      }
      if (!track) {
        return res.json(404, {
          message: 'No such track'
        });
      }
      return res.json(track);
    });
  },

  /**
  * TrackController.create()
  */
  create: function (req, res) {
    var track = new TrackModel({			name : req.body.name,      client: req.user.client,
      courses: req.body.courses
    });

    track.save(function (err, track) {
      if (err) {
        return res.json(500, {
          message: 'Error saving track',
          error: err
        });
      }
      return res.json(track);
    });
  },

  /**
  * TrackController.update()
  */
  update: function (req, res) {
    var id = req.params.id;
    TrackModel.findOne({_id: id}, function (err, track) {
      if (err) {
        return res.json(500, {
          message: 'Error saving track',
          error: err
        });
      }
      if (!track) {
        return res.json(404, {
          message: 'No such track'
        });
      }

      const attrs = [
        'name',
        'courses'
      ];

      attrs.forEach(attr => {
        track[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : track[attr];
      });

      track.save(function (err, track) {
        if (err) {
          return res.json(500, {
            message: 'Error getting track.'
          });
        }
        if (!track) {
          return res.json(404, {
            message: 'No such track'
          });
        }
        return res.json(track);
      });
    });
  },

  /**
  * TrackController.remove()
  */
  remove: function (req, res) {
    var id = req.params.id;
    TrackModel.remove({
      _id: id,
      client: req.user.client
    }, function(err, track){
      if(err) {
        return res.json(500, {
          message: 'Error deleting track.',
          error: err
        });
      }
      return res.json(track);
    });
  }
};
