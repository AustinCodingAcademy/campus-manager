const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();
const fetch = require('node-fetch');
const btoa = require('btoa');
const fileName = 'leadAttachments.json';
if (fs.existsSync(fileName)) {
  fs.unlinkSync(fileName);
}

let headers = {
  'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY),
  'Accept-Encoding': 'gzip'
};

const insightlyLeads = [];
const insightlyLeadAttachments = {};

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
    if (typeof leads === 'string') {
      console.log(leads);
      if (leads.contains('Second')) {
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
        headers = {
          'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY),
          'Accept-Encoding': 'gzip'
        };
        fetchInsightlyLeads(skip + 500);
      }, 200);
    } else {
      console.log('fetching insightly lead attachments');
      fetchInsightlyLeadAttachments(0);
    }
  }).catch(error => {
    console.log(error);
  });
}

function fetchInsightlyLeadAttachments(idx) {
  const lead = insightlyLeads[idx];
  fetch(`https://api.insight.ly/v2.2/Leads/${lead.LEAD_ID}/FileAttachments`, {
    method: 'GET',
    headers
  })
  .then(res => {
    return res.json();
  })
  .then(attachments => {
    if (typeof attachments === 'string') {
      console.log(attachments);
      if (attachments.contains('Second')) {
        headers = {
          'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY_2),
          'Accept-Encoding': 'gzip'
        };
        return fetchInsightlyLeadAttachments();
      } else {
        return process.exit();
      }
    }
    if ((idx + 1) % 500 === 0) console.log(`fetched attachments for ${idx + 1} leads`);
    insightlyLeadAttachments[lead.LEAD_ID] = attachments;
    if (idx < insightlyLeads.length - 1) {
      setTimeout(() => {
        headers = {
          'Authorization': 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY),
          'Accept-Encoding': 'gzip'
        };
        fetchInsightlyLeadAttachments(++idx);
      }, 200);
    } else {
      fs.writeFileSync(fileName, JSON.stringify(insightlyLeadAttachments, null, 2), 'utf8');
      console.log('uploading user attachments to S3');
      uploadAttachments();
    }
  })
  .catch(error => {
    console.log(error);
  });
}

function uploadAttachments() {
  s3.putObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: new Buffer(fs.readFileSync(fileName))
  }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`Successfully uploaded lead attachments to Amazon S3/${process.env.S3_BUCKET_NAME}/${fileName}`);
    }
    process.exit();
  });
}
