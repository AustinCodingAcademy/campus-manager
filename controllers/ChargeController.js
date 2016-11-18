var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var CourseModel = require('../models/CourseModel');
var UserModel = require('../models/UserModel');

/**
* ChargeController.js
*
* @description :: Server-side logic for managing stripe charges.
*/
module.exports = {

  charge: function(req, res) {
    UserModel.findOne({
      _id: req.body.user_id,
      client: req.user.client
    }, function(err, user) {
      if(err) {
        return res.json(500, {
          message: 'Error getting user.',
          error: err
        });
      }
      if(!user) {
        return res.json(404, {
          message: 'No such user'
        });
      }
      if (!user.customer_id) {
        stripe.customers.create({
          email: user.username
        }, function(err, customer) {
          if (err) { return res.json(500, { message: 'Error creating new customer.', error: err }); }
          user.customer_id = customer.id;
          user.save(function(err, user) {
            if (err) { return res.json(500, { message: 'Error saving customer id.', error: err }); }
            createCharge();
          });
        });
      } else {
        createCharge();
      }

      function createCharge() {
        stripe.customers.createSource(user.customer_id, {
          source: req.params.token
        }, function(err, card) {
          if (err) { return res.json(500, { message: 'Error creating card.', error: err }); }
          CourseModel.findOne({
            _id: req.body.course_id,
            client: req.user.client
          }).populate('term location').exec(function(err, course){
            if(err) {
              return res.json(500, {
                message: 'Error getting course.',
                error: err
              });
            }
            if(!course) {
              return res.json(404, {
                message: 'No such course'
              });
            }
            stripe.charges.create({
              source: card.id,
              customer: user.customer_id,
              currency: 'usd',
              amount: req.body.amount,
              metadata: {
                course_id: course._id.toString(),
                course_name: course.name,
                term_id: course.term._id.toString(),
                term_name: course.term.name,
                location_id: course.location._id.toString(),
                location_name: course.location.name,
                location_city: course.location.city,
                location_state: course.location.state,
                user_id: user._id.toString(),
                user_idn: user.idn,
                user_email: user.username,
                user_first_name: user.first_name,
                user_last_name: user.last_name,
                user_phone: user.phone
              }
            }, function(err, charge) {
              if (err) { return res.json(500, { message: 'Error making charge.', error: err }); }
              return res.json(200, charge);
            });
          });
        });
      }
    });
  }
};
