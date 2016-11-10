var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var _ = require('underscore');
var fs = require('fs-extra');
var json2csv = require('json2csv');

var collection = [];
function fetchAllStripeCharges(startingAfter) {
  stripe.charges.list({ limit: 100, starting_after: startingAfter }, function(err, charges) {
    if (err) { console.log(err); }
    _.each(charges.data, function(charge) {
      collection.push(charge);
    });
    if (charges.has_more) {
      fetchAllStripeCharges(_.last(charges.data).id);
    } else {
      fs.writeFileSync('tmp/stripe_payments.csv', json2csv({ data: collection }));
    }
  });
}
fetchAllStripeCharges();
