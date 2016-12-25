'use strict';

require('add-to-homescreen');
addToHomescreen();
import 'es6-shim';
import 'whatwg-fetch';
const Backbone = require('backbone');
// Backbone.ajax = require('backbone.fetch');
import React from 'react';
import ReactDOM from 'react-dom';
import 'react.backbone';
const moment = require('moment');
var $ = window.$ = window.jQuery = require('jquery');

const UserModel = require('./models/UserModel');
const TermModel = require('./models/TermModel');
const ReportModel = require('./models/ReportModel');
const CourseModel = require('./models/CourseModel');

const TermsCollection = require('./collections/TermsCollection');
const CoursesCollection = require('./collections/CoursesCollection');
const UsersCollection = require('./collections/UsersCollection');
const LocationsCollection = require('./collections/LocationsCollection');

const TermsListComponent = React.createFactory(require('./components/TermsListComponent'));
const CoursesListComponent = React.createFactory(require('./components/CoursesListComponent'));
const CourseComponent = React.createFactory(require('./components/CourseComponent'));
const HomeLayoutComponent = React.createFactory(require('./components/HomeLayoutComponent'));
const NavbarComponent = React.createFactory(require('./components/NavbarComponent'));
const UsersListComponent = React.createFactory(require('./components/UsersListComponent'));
const LocationsListComponent = React.createFactory(require('./components/LocationsListComponent'));
const RegistrationsListComponent = React.createFactory(require('./components/RegistrationsListComponent'));
const UserComponent = React.createFactory(require('./components/UserComponent'));
const ReportComponent = React.createFactory(require('./components/ReportComponent'));

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('error', function (e) {
    console.log(e.error);
  });
  $(document).ajaxError(function(e, xhr) {
    if (xhr.status === 401) {
      window.location.replace('/login');
    }
  });
  Backbone.$.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      '/': 'index',
      'terms': 'terms',
      'users': 'users',
      'users/:id': 'user',
      'courses': 'courses',
      'locations': 'locations',
      'courses/:id': 'course',
      'registration': 'registration',
      'report': 'report',
      'report/:query': 'report'
    },

    currentUser: new UserModel(JSON.parse(document.querySelector('[data-bootstrap]').getAttribute('data-bootstrap'))),

    initialize: function() {
      document.querySelector('[data-bootstrap]').remove();
      $('<div id="nav-container"></div>').insertBefore('#container');
      ReactDOM.render(NavbarComponent({ model: this.currentUser }), $('#nav-container')[0]);
    },

    execute: function(callback, args, name) {
      ReactDOM.unmountComponentAtNode($('#container')[0]);
      $(document).scrollTop(0);
      if (callback) callback.apply(this, args);
    },

    user: function(id) {
      const user = new UserModel({ _id: id });
      const terms = new TermsCollection();
      terms.fetch({
        success: () => {
          terms.reset(terms.filter(term => {
            return moment.utc(term.get('start_date')).isAfter(moment());
          }));
          terms.trigger('add');
        }
      });
      user.fetch({
        success: () => {
          ReactDOM.render(UserComponent({
            model: user,
            currentUser: this.currentUser,
            terms: terms
          }), $('#container')[0]);
        }
      });
    },

    index: function() {
      return this.navigate('users/' + this.currentUser.id, {trigger: true, replace: true});
    },

    terms: function() {
      var terms = new TermsCollection();
      terms.fetch();
      ReactDOM.render(TermsListComponent({ collection: terms }), $('#container')[0]);
    },

    users: function() {
      var users = new UsersCollection();
      users.fetch();
      ReactDOM.render(UsersListComponent({
        collection: users,
        currentUser: this.currentUser
       }), $('#container')[0]);
    },

    locations: function() {
      var locations = new LocationsCollection();
      locations.fetch();
      ReactDOM.render(LocationsListComponent({ collection: locations }), $('#container')[0]);
    },

    courses: function() {
      var that = this;
      var courses = new CoursesCollection();
      courses.fetch();
      var terms = new TermsCollection();
      terms.fetch({
        success: function() {
          var locations = new LocationsCollection();
          locations.fetch({
            success: function() {
              ReactDOM.render(CoursesListComponent({
                terms: terms,
                collection: courses,
                currentUser: that.currentUser,
                locations: locations
              }), $('#container')[0]);
            }
          });
        }
      });
    },

    course: function(id) {
      var course = new CourseModel({_id: id});
      course.fetch();
      ReactDOM.render(CourseComponent({
        model: course,
        currentUser: this.currentUser
      }), $('#container')[0]);
    },

    registration: function() {
      var that = this;
      var courses = new CoursesCollection();
      courses.fetch({
        success: function() {
          var users = new UsersCollection();
          users.fetch({
            success: function() {
              ReactDOM.render(RegistrationsListComponent({
                collection: courses,
                users: users,
                currentUser: that.currentUser
              }), $('#container')[0]);
            }
          });
        }
      });
    },

    report: function(query) {
      ReactDOM.render(ReportComponent({
        model: new ReportModel({
          sql: query ? atob(query) : "SELECT name, sql FROM sqlite_master WHERE type='table';"
        }),
        currentUser: this.currentUser
      }), $('#container')[0]);
    }
  });

  new AppRouter();
  Backbone.history.start();
}, false);
