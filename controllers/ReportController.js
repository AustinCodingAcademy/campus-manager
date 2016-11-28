var fs = require('fs-extra');
var sqlite3 = require('sqlite3');
var child_process = require('child_process');
var json2csv = require('json2csv');
var _ = require('underscore');
var UserModel = require('../models/UserModel');
var CourseModel = require('../models/CourseModel');
var TermModel = require('../models/TermModel');
var LocationModel = require('../models/LocationModel');
var moment = require('moment');
require('moment-range');
var AWS = require('aws-sdk');
var atob = require('atob');
var tableify = require('tableify');

/**
* ReportController.js
*
* @description :: Report Endpoints.
*/
module.exports = {
  index: function(req, res) {
    var timestamp = new Date().getTime()
    var tmpDir = 'tmp/';
    fs.mkdirsSync(tmpDir)
    var db = new sqlite3.Database(tmpDir + timestamp + '-report.sqlite3');
    var tables = [
      {
        model: UserModel,
        name: 'users'
      },
      {
        model: CourseModel,
        name: 'courses'
      },
      {
        model: TermModel,
        name: 'terms'
      },
      {
        model: LocationModel,
        name: 'locations'
      },
      {
        name: 'registrations'
      },
      {
        name: 'course_grades'
      },
      {
        name: 'student_grades'
      },
      {
        name: 'student_attendance'
      },
      {
        name: 'course_dates'
      },
      {
        name: 'stripe_payments'
      }
    ];

    var idx = 0;
    function createTable(table) {
      var fileName = tmpDir + timestamp + '-' + table.name + '.csv';
      if (table.model) {
        var fAS = table.model.findAndStreamCsv()
        var writeStream = fs.createWriteStream(fileName);
        writeStream.on('close', function() {
          importCsv(table, fileName);
        });
        fAS.pipe(writeStream);
      } else {
        var collection = [];
        switch(table.name) {
          case 'registrations':
            CourseModel.find(function(err, courses) {
              if (err) console.log(err);
              _.each(courses, function(course) {
                _.each(course.registrations, function(registration) {
                  collection.push({
                    course_id: course._id.toString(),
                    user_id: registration.toString()
                  });
                })
              });
              fs.writeFileSync(fileName, json2csv({ data: collection }));
              importCsv(table, fileName);
            });
            break;
          case 'course_grades':
            CourseModel.find(function(err, courses) {
              if (err) console.log(err);
              _.each(courses, function(course) {
                _.each(course.grades, function(grade) {
                  collection.push({
                    course_id: course._id.toString(),
                    name: grade.name,
                    checkpoint: grade.checkpoint
                  });
                })
              });
              fs.writeFileSync(fileName, json2csv({ data: collection }));
              importCsv(table, fileName);
            });
            break;
          case 'student_grades':
            UserModel.find(function(err, users) {
              if (err) console.log(err);
              _.each(users, function(user) {
                _.each(user.grades, function(grade) {
                  collection.push({
                    user_id: user._id.toString(),
                    course_id: grade.courseId,
                    name: grade.name,
                    score: grade.score
                  });
                })
              });
              fs.writeFileSync(fileName, json2csv({ data: collection }));
              importCsv(table, fileName);
            });
            break;
          case 'student_attendance':
            UserModel.find(function(err, users) {
              if (err) console.log(err);
              _.each(users, function(user) {
                _.each(user.attendance, function(checkIn) {
                  collection.push({
                    user_id: user._id.toString(),
                    date: checkIn.slice(0,10)
                  });
                })
              });
              fs.writeFileSync(fileName, json2csv({ data: collection }));
              importCsv(table, fileName);
            });
            break;
          case 'course_dates':
            CourseModel.find().populate('term').exec(function(err, courses) {
              if (err) console.log(err);
              _.each(courses, function(course) {
                var that = this;
                var classDates = [];
                moment.range(course.term.start_date, moment(course.term.end_date).add(1, 'days')).by('days', function(day) {
                  if (course.get('days').indexOf(day.format('dddd').toLowerCase()) > -1 &&
                  course.get('holidays').indexOf(day.format('YYYY-MM-DD')) === -1) {
                    classDates.push(day)
                  }
                });
                _.each(classDates, function(date) {
                  collection.push({
                    course_id: course._id.toString(),
                    date: date.format('YYYY-MM-DD')
                  });
                })
              });
              fs.writeFileSync(fileName, json2csv({ data: collection }));
              importCsv(table, fileName);
            });
            break;
          case 'stripe_payments':
            var s3 = new AWS.S3();
            s3.getObject({Bucket: process.env.S3_BUCKET_NAME, Key: 'stripe_payments.csv'}, function(err, data) {
              if (err) {
                console.log(err);
                importCsv(null, null, true);
              }  else  {
                fs.writeFileSync(fileName, data.Body);
                importCsv(table, fileName);
              }
            });
          break;
        }
      }
    }
    function importCsv(table, fileName, skip) {
      if (!skip) {
        child_process.execSync('(echo .separator ,; echo .import ' + fileName + ' ' + table.name + ') | sqlite3 ' + tmpDir + timestamp + '-report.sqlite3');
      }
      idx++;
      if (idx < tables.length) {
        createTable(tables[idx]);
      } else if (req.params.query) {
        db.serialize(function() {
          db.all(atob(req.params.query), function(err, rows) {
            if (req.query.format === 'json' || !req.query.format)  {
              res.json(200, rows);
            } else if (req.query.format === 'csv') {
              res.type('text/csv');
              res.send(200, json2csv({ data: rows}));
            } else if (req.query.format === 'html'){
              res.type('html');
              res.send(200, tableify(rows));
            }
          });
        });
      } else {
        res.type('arraybuffer');
        res.send(fs.readFileSync(tmpDir + timestamp + '-report.sqlite3'));
      }
    }
    createTable(tables[0]);
  }
};
