const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();
const fetch = require('node-fetch');
const btoa = require('btoa');
const fileName = 'leadNotes.json';
if (fs.existsSync(fileName)) {
  fs.unlinkSync(fileName);
}

let headers = {
  'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY),
  'Accept-Encoding': 'gzip'
};

const insightlyLeads = [];
const insightlyLeadNotes = {};

fetchInsightlyLeads(0);

function fetchInsightlyLeads(skip) {
  fetch(`https://api.insight.ly/v2.2/Leads/?converted=true&top=500&skip=${skip}`, {
    method: 'GET',
    headers
  })
  .then(res => {
    return res.json();
  })
  .then(leads => {
    if (typeof leadStatuses === 'string') {
      console.log(leadStatuses);
      if (leadStatuses.contains('Second')) {
        headers = {
          'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY_2),
          'Accept-Encoding': 'gzip'
        };
        return fetchInsightlyLeads();
      } else {
        return process.exit();
      }
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
      if (notes.contains('Second')) {
        headers = {
          'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY_2),
          'Accept-Encoding': 'gzip'
        };
        return fetchInsightlyLeadNotes();
      } else {
        return process.exit();
      }
    }
    if ((idx + 1) % 500 === 0) console.log(`fetched notes for ${idx + 1} leads`);
    insightlyLeadNotes[lead.LEAD_ID] = notes;
    if (idx < insightlyLeads.length - 1) {
      setTimeout(() => {
        fetchInsightlyLeadNotes(++idx);
      }, 200);
    } else {
      fs.writeFileSync(fileName, JSON.stringify(insightlyLeadNotes, null, 2), 'utf8');
      console.log('uploading user notes to S3');
      uploadNotes();
    }
  })
  .catch(error => {
    console.log(error);
  });
}

function uploadNotes() {
  s3.putObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: new Buffer(fs.readFileSync(fileName))
  }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`Successfully uploaded lead notes to Amazon S3/${process.env.S3_BUCKET_NAME}/${fileName}`);
    }
    process.exit();
  });
}
