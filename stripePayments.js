var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var _ = require('underscore');
var fs = require('fs-extra');
var json2csv = require('json2csv');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

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
      s3.putObject({Bucket: process.env.S3_BUCKET_NAME, Key: 'stripe_payments.csv', Body: json2csv({ data: collection })}, function(err, data) {
        if (err) {
          console.log(err)
        }  else  {
          console.log("Successfully uploaded data to " + process.env.S3_BUCKET_NAME + "/stripe_payments.csv");
        }
      });
    }
  });
}
fetchAllStripeCharges();
