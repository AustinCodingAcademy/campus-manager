const fs = require('fs');
const sqlite3 = require('sqlite3');
const json2csv = require('json2csv');
const moment = require('moment');
require('moment-range');
const AWS = require('aws-sdk');
const atob = require('atob');
const tableify = require('tableify');

/**
* ReportController.js
*
* @description :: Report Endpoints.
*/
module.exports = {
  index: function(req, res) {
    const fileName = 'report.sqlite3';
    if (
      !fs.existsSync(fileName) ||
      moment.utc(fs.statSync(fileName).ctime).isSameOrBefore(moment().subtract(10, 'minutes'))
    ) {
      const s3 = new AWS.S3();
      s3.getObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          fs.writeFileSync(fileName, data.Body);
          queryDatabase();
        }
      });
    } else {
      queryDatabase();
    }

    function queryDatabase() {
      if (req.params.query) {
        const db = new sqlite3.Database(fileName);
        db.serialize(() => {
          db.all(atob(req.params.query), function(err, rows) {
            if (err) {
              return res.json(500, { message: err.message, error: err });
            }
            if (req.query.format === 'json' || !req.query.format)  {
              return res.json(200, {
                results: rows,
                columnHeaders: rows[0] ? Object.keys(rows[0]) : []
              });
            } else if (req.query.format === 'csv') {
              res.set({
                'Content-Disposition': `attachment; filename=${Date.now()}.csv`,
                'Content-Type': 'text/csv'
              });
              return res.send(200, json2csv({ data: rows}));
            } else if (req.query.format === 'html'){
              res.type('html');
              return res.send(200, tableify(rows));
            } else if (req.query.format === 'webhook') {
              return res.json(200, rows);
            }
          });
        });
      } else {
        return res.json(500, { message: 'Enter a query', error: { message: 'Enter a query' }});
      }
    }
  }
};
