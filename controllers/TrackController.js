const TrackModel = require('../models/TrackModel.js');

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
    TrackModel.find({client: req.user.client})
    .populate({
      path: 'courses', populate: {
        path: 'location', model: 'location'
      }
    })
    .populate({
      path: 'courses', populate: {
        path: 'term', model: 'term'
      }
    })
    .exec()
    .then(tracks => {
      return res.json(tracks);
    })
    .catch(error => {
      return res.json(500, {
        message: 'Error getting track.',
        error
      });
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

    var track = new TrackModel({      name : req.body.name,      client: req.user.client,      courses: req.body.courses    });
    console.log(track);
    track.save()
    .then(track => {
      track.populate(
        { path: 'courses', populate: [{ path: 'location' }, { path: 'term' }] },
        (error, track) => {
          if (error) {
            return res.json(500, {
              message: 'Error populating track.',
              error
            });
          }
          return res.json(track);
        }
      )
    })
    .catch(error => {
      console.log(error);
      return res.json(500, {
        message: 'Error saving track',
        error
      });
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

      track.save()
      .then(track => {
        track.populate(
          { path: 'courses', populate: [{ path: 'location' }, { path: 'term' }] },
          (error, track) => {
            if (error) {
              return res.json(500, {
                message: 'Error populating track.',
                error
              });
            }
            return res.json(track);
          }
        )
      })
      .catch(error => {
        return res.json(500, {
          message: 'Error saving track',
          error
        });
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
