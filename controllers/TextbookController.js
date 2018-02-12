const TextbookModel = require('../models/TextbookModel');

/**
* TextbookController.js
*
* @description :: Server-side logic for managing textbooks.
*/
module.exports = {

  /**
  * TextbookController.list()
  */
  list: (req, res) => {
    TextbookModel.find({client: req.user.client}, (err, textbooks) => {
      if (err) {
        return res.json(500, {
          message: 'Error getting textbook.'
        });
      }
      return res.json(textbooks);
    });
  },

  /**
  * TextbookController.show()
  */
  show: (req, res) => {
    const id = req.params.id;
    TextbookModel.findOne({_id: id, client: req.user.client}, (err, textbook) => {
      if (err) {
        return res.json(500, {
          message: 'Error getting textbook.'
        });
      }
      if (!textbook) {
        return res.json(404, {
          message: 'No such textbook'
        });
      }
      return res.json(textbook);
    });
  },

  /**
  * TextbookController.create()
  */
  create: (req, res) => {
    const textbook = new TextbookModel({
			name : req.body.name,
      instructor_url: req.body.instructor_url,
      student_url: req.body.student_url,
      client: req.user.client,
    });

    textbook.save((err, textbook) => {
      if (err) {
        return res.json(500, {
          message: 'Error saving textbook',
          error: err
        });
      }
      return res.json(textbook);
    });
  },

  /**
  * TextbookController.update()
  */
  update: (req, res) => {
    const id = req.params.id;
    TextbookModel.findOne({_id: id}, (err, textbook) => {
      if (err) {
        return res.json(500, {
          message: 'Error saving textbook',
          error: err
        });
      }
      if (!textbook) {
        return res.json(404, {
          message: 'No such textbook'
        });
      }

      const attrs = [
        'name',
        'instructor_url',
        'student_url'
      ];

      attrs.forEach(attr => {
        textbook[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : textbook[attr];
      });

      textbook.save((err, textbook) => {
        if (err) {
          return res.json(500, {
            message: 'Error getting textbook.'
          });
        }
        if (!textbook) {
          return res.json(404, {
            message: 'No such textbook'
          });
        }
        return res.json(textbook);
      });
    });
  },

  /**
  * TextbookController.remove()
  */
  remove: (req, res) => {
    const id = req.params.id;
    TextbookModel.find({_id: id, client: req.user.client}, (err, textbook) => {
      if (err) {
        return res.json(500, {
          message: 'Error getting textbook.'
        });
      }
      return res.json(textbook);
    });
  }
};
