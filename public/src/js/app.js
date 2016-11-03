'use strict';

require('es6-shim');
var $ = window.$ = window.jQuery = require('jquery');
require('materialize');
require('picker');
require('picker.date');
require('picker.time');

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var AttendanceListComponent = React.createFactory(require('./components/AttendanceListComponent'));
var TermsCollection = require('./collections/TermsCollection');
var TermsListComponent = React.createFactory(require('./components/TermsListComponent'));
var CoursesCollection = require('./collections/CoursesCollection');
var CourseModel = require('./models/CourseModel');
var CoursesListComponent = React.createFactory(require('./components/CoursesListComponent'));
var CourseComponent = React.createFactory(require('./components/CourseComponent'));
var HomeLayoutComponent = React.createFactory(require('./components/HomeLayoutComponent'));
var NavbarComponent = React.createFactory(require('./components/NavbarComponent'));
var UserModel = require('./models/UserModel');
var UsersCollection = require('./collections/UsersCollection');
var LocationsCollection = require('./collections/LocationsCollection');
var UsersListComponent = React.createFactory(require('./components/UsersListComponent'));
var LocationsListComponent = React.createFactory(require('./components/LocationsListComponent'));
var RegistrationsListComponent = React.createFactory(require('./components/RegistrationsListComponent'));
var TermModel = require('./models/TermModel');
var UserComponent = React.createFactory(require('./components/UserComponent'));

$(function() {
  $(document).ajaxError(function(e, xhr) {
    if (xhr.status === 401) {
      window.location.replace('/login');
    }
    Materialize.toast(JSON.parse(xhr.responseText).message + ' See console for more info.', 4000, 'red darken-1');
    console.log(JSON.parse(xhr.responseText).error);
  });
  Backbone.$.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  $('#feedback').modal({
    complete: function(modal, trigger) {
      document.getElementById('feedback-iframe').contentWindow.location = '/feedback';
    },
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      '/': 'index',
      'attendance': 'attendance',
      'terms': 'terms',
      'users': 'users',
      'users/:id': 'user',
      'courses': 'courses',
      'locations': 'locations',
      'courses/:id': 'course',
      'registration': 'registration'
    },

    currentUser: new UserModel($('[data-bootstrap]').detach().data('bootstrap')),
    currentView: undefined,

    initialize: function() {
      $('<div id="nav-container"></div>').insertBefore('#container');
      ReactDOM.render(NavbarComponent({ model: this.currentUser }), $('#nav-container')[0]);
    },

    execute: function(callback, args, name) {
      ReactDOM.unmountComponentAtNode($('#container')[0]);
      $(document).scrollTop(0);
      if (callback) callback.apply(this, args);
    },

    user: function(id) {
      var that = this;
      var user = new UserModel({ _id: id });
      user.fetch({
        success: function() {
          ReactDOM.render(UserComponent({
            model: user,
            currentUser: that.currentUser
          }), $('#container')[0]);
        }
      });
    },

    attendance: function() {
      var users = new UsersCollection();
      users.fetch();
      ReactDOM.render(AttendanceListComponent({
        users: users,
        model: new UserModel()
      }), $('#container')[0]);
    },

    index: function() {
      return this.navigate('users/' + this.currentUser.id, {trigger: true, replace: true});
    },

    terms: function() {
      var terms = new TermsCollection();
      terms.fetch();
      var locations = new LocationsCollection();
      locations.fetch({
        success: function() {
          ReactDOM.render(TermsListComponent({ collection: terms, locations: locations}), $('#container')[0]);
        }
      });
    },

    users: function() {
      var users = new UsersCollection();
      users.fetch();
      ReactDOM.render(UsersListComponent({ collection: users }), $('#container')[0]);
    },

    locations: function() {
      var locations = new LocationsCollection();
      locations.fetch();
      ReactDOM.render(LocationsListComponent({ collection: locations }), $('#container')[0]);
    },

    courses: function() {
      var courses = new CoursesCollection();
      courses.fetch();
      var terms = new TermsCollection();
      terms.fetch({
        success: function() {
          ReactDOM.render(CoursesListComponent({
            terms: terms,
            collection: courses
          }), $('#container')[0]);
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
    }
  });

  new AppRouter();
  Backbone.history.start();
});
