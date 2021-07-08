const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();
const yosql = require('yosql');
const fetch = require('node-fetch');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
require('moment-range');

const fileName = 'report.sqlite3';
if (fs.existsSync(fileName)) {
  fs.unlinkSync(fileName);
}

const stripePayments = [];

const db = new sqlite3.Database(fileName);

yosql.loadDatabase(process.env.MONGODB_URI, {
  only: ['users', 'locations', 'terms', 'courses', 'textbooks', 'tracks']
}, (err, schema) => {
  if (err) return console.log(err);
  Object.keys(schema).forEach(table => {
    db.serialize(() => {
      db.run(schema[table].queries.create); // Create statement;
      db.run(schema[table].queries.insert); // Insert statement;
    });
  });
  courseDates()
});

function courseDates() {
  require('./models/CourseModel')
  .find({ client: mongoose.Types.ObjectId(process.env.CLIENT) })
  .populate('term')
  .exec((err, courses) => {
    if (err) { console.log(err); }
    const dates = [];
    courses.forEach(course => {
      moment
      .range(course.term.start_date, moment(course.term.end_date)
      .add(1, 'days'))
      .by('days', date => {
        if (
          course.get('days').includes(date.format('dddd').toLowerCase()) &&
          !course.get('holidays').includes(date.format('YYYY-MM-DD'))
        ) {
          dates.push({
            course_id: course._id.toString(),
            date: date.format('YYYY-MM-DD')
          });
        }
      });
    });
    console.log(`generating course_dates table`);
    yosql.createTable(db, 'course_dates', dates, {}, () => {
      console.log('fetching stripe charges');
      fetchAllStripeCharges();
    });
  });
}

function fetchAllStripeCharges(startingAfter) {
  stripe.charges.list({ limit: 100, starting_after: startingAfter }, (err, charges) => {
    if (err) { console.log(err); }
    Array.prototype.push.apply(stripePayments, charges.data);
    console.log(`fetched ${charges.data.length} payments`);
    if (charges.has_more) {
      fetchAllStripeCharges(charges.data[charges.data.length - 1].id);
    } else {
      console.log('generating stripe_payments table');
      yosql.createTable(db, 'stripe_payments', stripePayments, {}, () => {
        console.log('fetching insightly lead statuses');
        // uploadDatabase();
      });
    }
  });
}

function uploadDatabase() {
  s3.putObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: new Buffer(fs.readFileSync(fileName))
  }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`Successfully uploaded data to Amazon S3/${process.env.S3_BUCKET_NAME}/${fileName}`);
    }
    fetch(process.env.SNITCH_URL, {
      headers: {
        'Content-Type': 'application/x-www-url-formencoded'
      }
    })
    .then(() => {
      process.exit();
    })
    .catch(error => {
      console.log(error);
    });
  });
}
