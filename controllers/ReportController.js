var fs = require('fs-extra');
var sqlite3 = require('sqlite3').verbose();
var child_process = require('child_process');
var json2csv = require('json2csv');
var _ = require('underscore');
var UserModel = require('../models/UserModel');
var CourseModel = require('../models/CourseModel');
var TermModel = require('../models/TermModel');
var LocationModel = require('../models/LocationModel');

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
        }
      }
    }
    function importCsv(table, fileName) {
      child_process.execSync('(echo .separator ,; echo .import ' + fileName + ' ' + table.name + ') | sqlite3 ' + tmpDir + timestamp + '-report.sqlite3');
      idx++;
      if (idx < tables.length) {
        createTable(tables[idx])
      } else {
        res.type('text/plain');
        res.send(db);
      }
    }
    createTable(tables[0]);
  }
};
