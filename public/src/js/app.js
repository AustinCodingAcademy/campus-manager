'use strict';

var $ = window.$ = window.jQuery = require('jquery');
require('materialize');
require('picker');
require('picker.date');
require('picker.time');

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

var AttendanceListComponent = require('./components/AttendanceListComponent');
var TermsCollection = require('./collections/TermsCollection');
var TermsListComponent = require('./components/TermsListComponent');
var CoursesCollection = require('./collections/CoursesCollection');
var CourseModel = require('./models/CourseModel');
var CoursesListComponent = require('./components/CoursesListComponent');
var CourseComponent = require('./components/CourseComponent');
var HomeLayoutComponent = require('./components/HomeLayoutComponent');
var NavbarComponent = require('./components/NavbarComponent');
var UserModel = require('./models/UserModel');
var UsersCollection = require('./collections/UsersCollection');
var UsersListComponent = require('./components/UsersListComponent');
var RegistrationsListComponent = require('./components/RegistrationsListComponent');
var TermModel = require('./models/TermModel');
var StudentComponent = require('./components/StudentComponent');

$(function() {
  $(document).ajaxError(function(e, xhr) {
    if (xhr.status === 401) {
      window.location.replace('/login');
    }
    Materialize.toast(JSON.parse(xhr.responseText).message + ' See console for more info.', 4000, 'red darken-1');
    console.log(JSON.parse(xhr.responseText).error);
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      '/': 'index',
      'attendance': 'attendance',
      'terms': 'terms',
      'users': 'users',
      'users/:id': 'student',
      'courses': 'courses',
      'courses/:id': 'course',
      'registration': 'registration'
    },

    currentUser: new UserModel($('[data-bootstrap]').detach().data('bootstrap')),
    currentView: undefined,

    initialize: function() {
      $('<div class="navbar-fixed"><nav></nav></div>').insertBefore('#container');
      ReactDOM.render(<NavbarComponent model={this.currentUser} />, $('nav')[0]);
    },

    student: function(id) {
      var student = new UserModel({ _id: id });
      student.fetch();
      ReactDOM.render(<StudentComponent model={student} />, $('#container')[0]);
    },

    attendance: function() {
      var users = new UsersCollection();
      users.fetch();
      ReactDOM.render(<AttendanceListComponent users={users} model={new UserModel()} />, $('#container')[0]);
    },

    index: function() {
      if (this.currentUser.get('is_student')) {
        return this.navigate('users/' + this.currentUser.id, {trigger: true, replace: true});
      }
      var terms = new TermsCollection();
      terms.fetch();
      ReactDOM.render(<HomeLayoutComponent collection={terms} />, $('#container')[0]);
    },

    terms: function() {
      var terms = new TermsCollection();
      terms.fetch();
      ReactDOM.render(<TermsListComponent collection={terms} />, $('#container')[0]);
    },

    users: function() {
      var users = new UsersCollection();
      users.fetch();
      ReactDOM.render(<UsersListComponent collection={users} />, $('#container')[0]);
    },

    courses: function() {
      var courses = new CoursesCollection();
      courses.fetch();
      var terms = new TermsCollection();
      terms.fetch({
        success: function() {
          ReactDOM.render(<CoursesListComponent terms={terms} collection={courses} />, $('#container')[0]);
        }
      });
    },

    course: function(id) {
      var course = new CourseModel({_id: id});
      course.fetch();
      ReactDOM.render(<CourseComponent model={course} currentUser={this.currentUser}/>, $('#container')[0]);
    },

    registration: function() {
      var courses = new CoursesCollection();
      courses.fetch({
        success: function() {
          var users = new UsersCollection();
          users.fetch({
            success: function() {
              ReactDOM.render(<RegistrationsListComponent collection={courses} users={users} />, $('#container')[0]);
            }
          })
        }
      });
    }
  });

  new AppRouter();
  Backbone.history.start();
});
