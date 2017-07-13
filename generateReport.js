const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();
const yosql = require('yosql');
const fetch = require('node-fetch');
const btoa = require('btoa');
const moment = require('moment');
require('moment-range');
let headers = {
  'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY),
  'Accept-Encoding': 'gzip'
};

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI);

const fileName = 'report.sqlite3';
if (fs.existsSync(fileName)) {
  fs.unlinkSync(fileName);
}
const db = yosql.createDatabase(fileName);
db.serialize(() => {
  return generateReport();
});

const stripePayments = [];
const insightlyLeads = [];

function generateReport() {
  const tables = {
    'users': require('./models/UserModel'),
    'locations': require('./models/LocationModel'),
    'terms': require('./models/TermModel'),
    'courses': require('./models/CourseModel'),
    'textbooks': require('./models/TextbookModel'),
    'tracks': require('./models/TrackModel')
  };

  const tableNames = Object.keys(tables);
  function createTable(idx) {
    const tableName = tableNames[idx];
    tables[tableName].find({ client: mongoose.Types.ObjectId(process.env.CLIENT) }, (err, documents) => {
      if (err) { console.log(err); }
      console.log(`generating ${tableName} tables`);
      yosql.createTable(db, tableName, JSON.parse(JSON.stringify(documents)), {}, () => {
        if (idx < tableNames.length - 1) {
          createTable(++idx);
        } else {
          courseDates();
        }
      });
    });
  }
  return createTable(0);
}

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
        fetchInsightlyLeadStatuses();
      });
    }
  });
}

function fetchInsightlyLeadStatuses() {
  fetch('https://api.insight.ly/v2.2/LeadStatuses?converted=true', {
    method: 'GET',
    headers
  })
  .then(res => {
    return res.json();
  })
  .then(leadStatuses => {
    if (typeof leadStatuses === 'string') {
      console.log(leadStatuses);
      headers = {
        'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY_2),
        'Accept-Encoding': 'gzip'
      };
      return createLeadsTable();
    }
    console.log('generating insightly_lead_statuses table');
    yosql.createTable(db, 'insightly_lead_statuses', leadStatuses, {}, () => {
      console.log('fetching insightly leads');
      fetchInsightlyLeads(0);
    });
  })
  .catch(error => {
    console.log(error);
  });
}

function fetchInsightlyLeads(skip) {
  fetch(`https://api.insight.ly/v2.2/Leads/?converted=true&top=500&skip=${skip}`, {
    method: 'GET',
    headers
  })
  .then(res => {
    return res.json();
  })
  .then(leads => {
    if (typeof leads === 'string') {
      console.log(leads);
      headers = {
        'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY_2),
        'Accept-Encoding': 'gzip'
      };
      return fetchInsightlyLeads(skip);
    }
    Array.prototype.push.apply(insightlyLeads, leads);
    console.log(`fetched ${leads.length} leads`);
    if (leads.length === 500) {
      setTimeout(() => {
        fetchInsightlyLeads(skip + 500);
      }, 200);
    } else {
      console.log('fetching insightly lead notes');
      fetchInsightlyLeadNotes(0);
    }
  }).catch(error => {
    console.log(error);
  });
}

function fetchInsightlyLeadNotes(idx) {
  const lead = insightlyLeads[idx];
  fetch(`https://api.insight.ly/v2.2/Leads/${lead.LEAD_ID}/Notes`, {
    method: 'GET',
    headers
  })
  .then(res => {
    return res.json();
  })
  .then(notes => {
    if (typeof notes === 'string') {
      console.log(notes);
      headers = {
        'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY_2),
        'Accept-Encoding': 'gzip'
      };
      return fetchInsightlyLeadNotes(idx);
    }
    if ((idx + 1) % 5 === 0) console.log(`fetched notes for ${idx + 1} leads`);
    lead.NOTES = notes;
    if (idx < insightlyLeads.length - 1) {
      setTimeout(() => {
        fetchInsightlyLeadNotes(++idx);
      }, 200);
    } else {
      console.log('generating insightly_leads table');
      createLeadsTable();
    }
  })
  .catch(error => {
    console.log(error);
  });
}

function createLeadsTable() {
  yosql.createTable(db, 'insightly_leads', insightlyLeads, {}, () => {
    db.close();
    uploadDatabase();
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
    process.exit();
  });
}
