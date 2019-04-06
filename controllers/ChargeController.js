var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var CourseModel = require('../models/CourseModel');
var UserModel = require('../models/UserModel');
var plaid = require('plaid');

/**
* ChargeController.js
*
* @description :: Server-side logic for managing stripe charges.
*/
module.exports = {

  charge: async function(req, res) {
    UserModel.findOne({
      _id: req.body.user_id,
      client: req.user.client
    }, async function(err, user) {
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
        }, async function(err, customer) {
          if (err) { return res.json(500, { message: 'Error creating new customer.', error: err }); }
          user.customer_id = customer.id;
          user.save(async (err, user) => {
            if (err) { return res.json(500, { message: 'Error saving customer id.', error: err }); }
            const charge = await createCharge(req, res, user, req.params.token);
            return res.json(charge);
          });
        });
      } else {
        const charge = await createCharge(req, res, user, req.params.token);
        return res.json(charge);
      }
    });
  },

  plaid: async (req, res) => {
    // Change sandbox to development to test with live users and change
    // to production when you're ready to go live!

    var plaidClient = new plaid.Client(
      process.env.PLAID_CLIENT_ID,
      process.env.PLAID_SECRET,
      process.env.PLAID_PUBLIC_KEY,
      plaid.environments[process.env.PLAID_ENV]
    );

    plaidClient.exchangePublicToken(req.body.metadata.public_token,
    async function(err, plaidRes1) {

      // Generate a bank account token
      plaidClient.createStripeToken(plaidRes1.access_token, req.body.metadata.account_id,
      async function (err, plaidRes2) {
        UserModel.findOne({
          _id: req.body.user_id,
          client: req.user.client
        }, async function(err, user) {
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
            }, async function(err, customer) {
              if (err) { return res.json(500, { message: 'Error creating new customer.', error: err }); }
              user.customer_id = customer.id;
              user.save(async function(err, user) {
                if (err) { return res.json(500, { message: 'Error saving customer id.', error: err }); }
                const charge = await createCharge(req, res, user, plaidRes2.stripe_bank_account_token);
                return res.json(charge);
              });
            });
          } else {
            const charge = await createCharge(req, res, user, plaidRes2.stripe_bank_account_token);
            return res.json(charge);
          }
        });
      });
    });
  }
};

const createCharge = async (req, res, user, token) => {
  try {
    const sources = await stripe.customers.listSources(user.customer_id);
    const tokenAccount = await stripe.tokens.retrieve(token);
    let source = sources.data.find(source => {
      if ((tokenAccount.card || tokenAccount.bank_account).last4 !== source.last4) return;
      if (tokenAccount.card) {
        return tokenAccount.card.exp_month === source.exp_month &&
          tokenAccount.card.exp_year === source.exp_year
      } else if (tokenAccount.bank_account) {
        return tokenAccount.bank_account.routing_number === source.routing_number
      }
    });
    if (!source) {
      source = await stripe.customers.createSource(user.customer_id, { source: token });
    }
    const course = await CourseModel.findOne({
      _id: req.body.course_id,
      client: req.user.client
    }).populate('term location').exec();

    const charge = await stripe.charges.create({
      source: source.id,
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
        user_phone: user.phone,
        fee: req.body.fee
      }
    });
    return charge;
  } catch (error) {
    console.error(error);
  }
}
