/**
* @module controllers/UserController
* @description Server-side logic for managing users.
*/

var UserModel = require('../models/UserModel');
var _ = require('underscore');
const gravatar = require('gravatar');
const fs = require('fs');
var moment = require('moment');
var CourseModel = require('../models/CourseModel')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const utils = require('../src/js/utils');
var transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: process.env.MANDRILL_API_KEY
  }
}));
const exportResume = require('../node_modules/resume-cli/lib/export-resume/index.js');

module.exports = {

  /**
  * List all users attached to the current user's client
  * @param {req} req [Express.js Request object]{@link http://expressjs.com/en/api.html#req}
  * @param {res} res [Express.js Response object]{@link http://expressjs.com/en/api.html#res}
  */
  list: function(req, res) {
    UserModel.find({
      client: req.user.client
    }, null, {
      sort: 'last_name',
    }, function(err, users){
      if(err) {
        return res.json(500, {
          message: 'Error getting users.',
          error: err
        });
      }
      return res.json(users);
    });
  },

  /**
  * Show all details of a particular user if attached to current user's client
  * @param {req} req [Express.js Request object]{@link http://expressjs.com/en/api.html#req}
  * @param {res} res [Express.js Response object]{@link http://expressjs.com/en/api.html#res}
  */
  show: function(req, res) {
    var id = req.params.id;
    UserModel.findOne({
      _id: id,
      client: req.user.client
    }, function(err, user){
      if(err) {
        return res.json(500, {
          message: 'Error getting user.',
          error: err
        });
      }
      if(!user) {
        return res.json(404, {
          message: 'No such user'
        });
      }
      CourseModel.find({
        registrations: mongoose.Types.ObjectId(user._id)
      }).populate('term location textbook').exec(function(err, courses) {
        if(err) {
          return res.json(500, {
            message: 'Error getting user courses.',
            error: err
          });
        }
        user.courses = courses;
        if (user.customer_id) {
          stripe.charges.list(
            {
              customer: user.customer_id,
              limit: 100
            },
            function(err, charges) {
              if (err) console.log(err);
              if (charges) {
                user.charges = charges.data;
              }
              return res.json(user);
            }
          );
        } else {
          return res.json(user);
        }
      });
    });
  },

  /**
  * Create a new user and attach to current user's client
  * @param {req} req [Express.js Request object]{@link http://expressjs.com/en/api.html#req}
  * @param {res} res [Express.js Response object]{@link http://expressjs.com/en/api.html#res}
  */
  create: function(req, res) {
    var user = new UserModel();

    var attributes = [
      'campus',
      'credits',
      'email',
      'first_name',
      'github',
      'is_admin',
      'is_instructor',
      'is_student',
      'last_name',
      'linkedIn',
      'phone',
      'rocketchat',
      'website',
      'zipcode',
    ];

    _.each(attributes, function(attr) {
      user[attr] = req.body[attr];
    });
    user.username = req.body.username.toLowerCase();

    UserModel.find({}, 'idn', { limit: 1, sort: { idn: -1 } }, function(err, users) {
      user.idn = users[0].idn + 1;
      user.client = req.user.client;
      user.save(function(err, user){
        if(err) {
          return res.json(500, {
            message: 'Error saving user',
            error: err
          });
        }
        const key = utils.campusKey(user);
        transport.sendMail({
          from: `info@${key}codingacademy.com`,
          to: user.username,
          subject: 'Welcome to Campus Manager!',
          html: `Welcome to Campus Manager! To set your password, please visit https://campus.${key}codingacademy.com/reset to set your password.`
        }, function (err, info) {
          if (err) {
            return res.json(500, {
              message: 'Error sending confirmation email. Please contact support for additional assistance.'
            })
          }
          return res.json(user);
        });
      });
    });
  },

  /**
  * Update an existing user if attached to current user's client
  * @param {req} req [Express.js Request object]{@link http://expressjs.com/en/api.html#req}
  * @param {res} res [Express.js Response object]{@link http://expressjs.com/en/api.html#res}
  */
  update: function(req, res) {
    var id = req.params.id;
    UserModel.findOne({
      _id: id,
      client: req.user.client
    }, function(err, user){
      if(err) {
        return res.json(500, {
          message: 'Error saving user',
          error: err
        });
      }
      if(!user) {
        return res.json(404, {
          message: 'No such user'
        });
      }

      var attributes = [
        'first_name',
        'github',
        'last_name',
        'linkedIn',
        'phone',
        'reviews',
        'rocketchat',
        'username',
        'website',
        'zipcode',
      ];

      var adminAttrs = [
        'campus',
        'credits',
        'is_admin',
        'is_instructor',
        'is_student',
        'price',
      ];

      if (req.user.is_admin) {
        _.each(adminAttrs, function(attr) {
          user[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : user[attr];
        });
        if (req.body.generate_api_key) {
          var rand = function() {
            return Math.random().toString(36).substr(2); // remove `0.`
          };

          var token = function() {
            return rand() + rand(); // to make it longer
          };

          user.api_key = token();
        }
      }

      if (req.user.is_admin || req.user._id.toString() === id) {
        _.each(attributes, function(attr) {
          user[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : user[attr];
        });
      }

      user.save(function(err, user){
        if(err) {
          return res.json(500, {
            message: 'Error getting user.',
            error: err
          });
        }
        if(!user) {
          return res.json(404, {
            message: 'No such user'
          });
        }
        CourseModel.find({
          registrations: mongoose.Types.ObjectId(user._id)
        }).populate('term').exec(function(err, courses) {
          if(err) {
            return res.json(500, {
              message: 'Error getting user courses.',
              error: err
            });
          }
          user.courses = courses;
          user.charges = req.body.charges;
          return res.json(user);
        });
      });
    });
  },

  /**
  * Destroy a user if attached to current user's client
  * @param {req} req [Express.js Request object]{@link http://expressjs.com/en/api.html#req}
  * @param {res} res [Express.js Response object]{@link http://expressjs.com/en/api.html#res}
  */
  remove: function(req, res) {
    var id = req.params.id;
    UserModel.remove({
      _id: id,
      client: req.user.client
    }, function(err, user){
      if(err) {
        return res.json(500, {
          message: 'Error getting user.',
          error: err
        });
      }
      return res.json(user);
    });
  },

  import: function(req, res) {
    var newUsers = [];
    UserModel.find({client: req.user.client}, 'idn', { limit: 1, sort: { idn: -1 } }, function(err, users) {
      var idn = users[0].idn + 1;
      var idx = 0;
      function newUser(reqUser) {
        UserModel.findOne({ username: reqUser['username'].toLowerCase() }, function(err, existingUser) {
          if (!existingUser && reqUser['username'] && reqUser['first_name'] && reqUser['last_name']) {
            var user = new UserModel({ idn: idn });
            idn++;
            var attributes = [
              'first_name',
              'github',
              'last_name',
              'linkedIn',
              'phone',
              'website',
              'zipcode'
            ];

            _.each(attributes, function(attr) {
              user[attr] = reqUser[attr] ? reqUser[attr] : user[attr];
            });
            user.username = reqUser.username ? reqUser.username.toLowerCase() : user.username;
            user.is_student = true;
            user.client = req.user.client;
            user.save(function(err, user) {
              if(err) {
                return res.json(500, {
                  message: 'Error creating user.',
                  error: err
                });
              }
              newUsers.push(user);
              if (req.body[++idx]) {
                newUser(req.body[idx]);
              } else {
                return res.json(200, newUsers);
              }
            });
          } else {
            if (req.body[++idx]) {
              newUser(req.body[idx]);
            } else {
              return res.json(200, newUsers);
            }
          }
        });
      }
      if (req.body.length > 1) {
        return newUser(req.body[idx]);
      } else {
        return res.json(200, req.body);
      }
    });
  },

  attendance: function(req, res) {
    UserModel.findOne({ idn: req.body.idn, client: req.user.client }, function(err, user) {
      if(err) {
        return res.json(500, {
          message: 'Error saving user',
          error: err
        });
      }
      if (!user.attendance) {
        user.attendance = [];
      }
      var matched = _.find(user.attendance, function(date) { return moment(date, 'YYYY-MM-DD HH:ss').isSame(req.body.date, 'day')});
      if (matched) {
        user.attendance.splice(user.attendance.indexOf(matched), 1);
      } else {
        user.attendance.push(req.body.date);
      }

      user.save(() => {
        return res.json(req.body);
      });
    });
  },

  resume: (req, res) => {
    UserModel.findOne({
      _id: req.params.id
    }, function(err, user){
      const fileName = `resumes/${user.idn}${user.first_name}${user.last_name}.html`;
      const userJSON = {
        "basics": {
          "name": `${user.first_name} ${user.last_name}`,
          "label": "Web Developer",
          "picture": user.resume.pictureURL || gravatar.url(user.username, {s: '100', r: 'x', d: 'retro'}, true),
          "email": user.username,
          "phone": user.phone,
          "website": user.website,
          "summary": "Summary",
          "location": {
            "address": "",
            "postalCode": "",
            "city": "",
            "countryCode": "",
            "region": ""
          },
          "profiles": [
            {
              "network": "GitHub",
              "username": user.github,
              "url": `https://github.com/${user.github}`
            },
            {
              "network": "LinkedIn",
              "username": user.linkedIn,
              "url": `https://linkedin.com/in/${user.linkedIn}`
            }
          ]
        },
        "work": [
          {
            "company": "Pied Piper",
            "position": "CEO/President",
            "website": "http://piedpiper.com",
            "startDate": "2013-12-01",
            "endDate": "2014-12-01",
            "summary": "Pied Piper is a multi-platform technology based on a proprietary universal compression algorithm that has consistently fielded high Weisman Scores™ that are not merely competitive, but approach the theoretical limit of lossless compression.",
            "highlights": [
              "Build an algorithm for artist to detect if their music was violating copy right infringement laws",
              "Successfully won Techcrunch Disrupt",
              "Optimized an algorithm that holds the current world record for Weisman Scores"
            ]
          }
        ],
        "volunteer": [
          {
            "organization": "CoderDojo",
            "position": "Teacher",
            "website": "http://coderdojo.com/",
            "startDate": "2012-01-01",
            "endDate": "2013-01-01",
            "summary": "Global movement of free coding clubs for young people.",
            "highlights": [
              "Awarded 'Teacher of the Month'"
            ]
          }
        ],
        "education": [
          {
            "institution": "Austin Coding Academy",
            "area": "Information Technology",
            "studyType": "Bachelor",
            "startDate": "2011-06-01",
            "endDate": "2014-01-01",
            "gpa": "4.0",
            "courses": [
              "DB1101 - Basic SQL",
              "CS2011 - Java Introduction"
            ]
          }
        ],
        "awards": [
          {
            "title": "Digital Compression Pioneer Award",
            "date": "2014-11-01",
            "awarder": "Techcrunch",
            "summary": "There is no spoon."
          }
        ],
        "publications": [
          {
            "name": "Video compression for 3d media",
            "publisher": "Hooli",
            "releaseDate": "2014-10-01",
            "website": "http://en.wikipedia.org/wiki/Silicon_Valley_(TV_series)",
            "summary": "Innovative middle-out compression algorithm that changes the way we store data."
          }
        ],
        "skills": [
          {
            "name": "Web Development",
            "level": "Master",
            "keywords": [
              "HTML",
              "CSS",
              "Javascript"
            ]
          },
          {
            "name": "Compression",
            "level": "Master",
            "keywords": [
              "Mpeg",
              "MP4",
              "GIF"
            ]
          }
        ],
        "languages": [
          {
            "language": "English",
            "fluency": "Native speaker"
          }
        ],
        "interests": [
          {
            "name": "Wildlife",
            "keywords": [
              "Ferrets",
              "Unicorns"
            ]
          }
        ],
        "references": [
          {
            "name": "Erlich Bachman",
            "reference": "It is my pleasure to recommend Richard, his performance working as a consultant for Main St. Company proved that he will be a valuable addition to any company."
          }
        ]
      }
      exportResume(userJSON, fileName, { theme: 'modern', format: 'html' }, () => {
        return res.send(fs.readFileSync(fileName, 'utf8'));
      });
    });
  }
};
