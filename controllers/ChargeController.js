var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
* ChargeController.js
*
* @description :: Server-side logic for managing stripe charges.
*/
module.exports = {

  charge: function(req, res) {
    if (!req.user.customer_id) {
      stripe.customers.create({
        email: req.user.username
      }, function(err, customer) {
        if (err) { return res.json(500, { message: 'Error creating new customer.', error: err }); }
        req.user.customer_id = customer.id;
        req.user.save(function(err, user) {
          if (err) { return res.json(500, { message: 'Error saving customer id.', error: err }); }
          createCharge();
        });
      });
    } else {
      createCharge();
    }

    function createCharge() {
      stripe.customers.createSource(req.user.customer_id, {
        source: req.params.token
      }, function(err, card) {
        if (err) { return res.json(500, { message: 'Error creating card.', error: err }); }
        stripe.charges.create({
          source: card.id,
          customer: req.user.customer_id,
          currency: 'usd',
          amount: req.body.amount
        }, function(err, charge) {
          if (err) { return res.json(500, { message: 'Error making charge.', error: err }); }
          return res.json(200, charge);
        });
      })
    }
  }
};
