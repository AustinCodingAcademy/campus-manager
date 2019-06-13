'use strict';
import "babel-polyfill";
import 'es6-shim';
import 'whatwg-fetch';
const Backbone = require('backbone');
// Backbone.ajax = require('backbone.fetch');
import React from 'react';
import ReactDOM from 'react-dom';
import 'react.backbone';
const moment = require('moment');
const $ = window.$ = window.jQuery = require('jquery');

const UserModel = require('./models/UserModel');
const TermModel = require('./models/TermModel');
const ReportModel = require('./models/ReportModel');
const CourseModel = require('./models/CourseModel');

const TermsCollection = require('./collections/TermsCollection');
const CoursesCollection = require('./collections/CoursesCollection');
const UsersCollection = require('./collections/UsersCollection');
const LocationsCollection = require('./collections/LocationsCollection');
const TracksCollection = require('./collections/TracksCollection');
const TextbooksCollection = require('./collections/TextbooksCollection');

const TermsListComponent = React.createFactory(require('./components/TermsListComponent'));
const CoursesListComponent = React.createFactory(require('./components/CoursesListComponent'));
const CourseComponent = React.createFactory(require('./components/CourseComponent'));
const HomeLayoutComponent = React.createFactory(require('./components/HomeLayoutComponent'));
const NavbarComponent = React.createFactory(require('./components/NavbarComponent'));
const UsersListComponent = React.createFactory(require('./components/UsersListComponent'));
const LocationsListComponent = React.createFactory(require('./components/LocationsListComponent'));
const TracksListComponent = React.createFactory(require('./components/TracksListComponent'));
const TextbooksListComponent = React.createFactory(require('./components/TextbooksListComponent'));
const RegistrationsListComponent = React.createFactory(require('./components/RegistrationsListComponent'));
const UserComponent = React.createFactory(require('./components/UserComponent'));
const ReportComponent = React.createFactory(require('./components/ReportComponent'));

// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
  };
}

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
      'textbooks': 'textbooks',
      'tracks': 'tracks',
      'courses/:id': 'course',
      'registrations': 'registrations',
      'report': 'report',
      'report/:query': 'report'
    },

    currentUser: new UserModel(JSON.parse(document.getElementById('dataBootstrap').getAttribute('data-bootstrap'))),

    initialize: function() {
      document.getElementById('dataBootstrap').remove();
      $('<div id="nav-container"></div>').insertBefore('#container');
      ReactDOM.render(NavbarComponent({ model: this.currentUser }), document.getElementById('nav-container'));
    },

    execute: function(callback, args, name) {
      ReactDOM.unmountComponentAtNode(document.getElementById('container'));
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
          }), document.getElementById('container'));
        }
      });
    },

    index: function() {
      return this.navigate('users/' + this.currentUser.id, {trigger: true, replace: true});
    },

    terms: function() {
      var terms = new TermsCollection();
      terms.fetch();
      ReactDOM.render(TermsListComponent({ collection: terms }), document.getElementById('container'));
    },

    users: function() {
      var users = new UsersCollection();
      users.fetch();
      ReactDOM.render(UsersListComponent({
        collection: users,
        currentUser: this.currentUser
      }), document.getElementById('container'));
    },

    locations: function() {
      var locations = new LocationsCollection();
      locations.fetch();
      ReactDOM.render(LocationsListComponent({ collection: locations }), document.getElementById('container'));
    },

    tracks: () => {
      const courses = new CoursesCollection();
      courses.fetch();
      const tracks = new TracksCollection();
      tracks.fetch();
      ReactDOM.render(TracksListComponent({
        collection: tracks,
        courses: courses
      }), document.getElementById('container'));
    },

    textbooks: function() {
      const textbooks = new TextbooksCollection();
      textbooks.fetch();
      ReactDOM.render(TextbooksListComponent({ collection: textbooks }), document.getElementById('container'));
    },

    courses: function() {
      const courses = new CoursesCollection();
      courses.fetch();
      const terms = new TermsCollection();
      terms.fetch();
      const locations = new LocationsCollection();
      locations.fetch();
      const textbooks = new TextbooksCollection();
      textbooks.fetch();
      const users = new UsersCollection();
      users.fetch();
      ReactDOM.render(CoursesListComponent({
        collection: courses,
        currentUser: this.currentUser,
        terms,
        locations,
        textbooks,
        users
      }), document.getElementById('container'));
    },

    course: function(id) {
      var course = new CourseModel({_id: id});
      course.fetch();
      ReactDOM.render(CourseComponent({
        model: course,
        currentUser: this.currentUser
      }), document.getElementById('container'));
    },

    registrations: function() {
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
              }), document.getElementById('container'));
            }
          });
        }
      });
    },

    report: function(query) {
      ReactDOM.render(ReportComponent({
        model: new ReportModel({
          sql: query ? atob(query) :
`SELECT *
FROM users
JOIN courses_registrations ON courses_registrations.registrations = users._id
JOIN courses ON courses.yosql_id = courses_registrations.courses_yosql_id
JOIN terms ON terms._id = courses.term
JOIN locations on locations._id = courses.location;`
        }),
        browse: new ReportModel({
          sql: "SELECT name, sql FROM sqlite_master WHERE type='table';",
          hash: btoa("SELECT name, sql FROM sqlite_master WHERE type='table';"),
          browse: true
        }),
        currentUser: this.currentUser
      }), document.getElementById('container'));
    }
  });

  new AppRouter();
  Backbone.history.start();
}, false);
