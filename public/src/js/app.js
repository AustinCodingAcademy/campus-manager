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
var CoursesListComponent = require('./components/CoursesListComponent');
var HomeLayoutComponent = require('./components/HomeLayoutComponent');
var NavbarComponent = require('./components/NavbarComponent');
var UserModel = require('./models/UserModel');
var UsersCollection = require('./collections/UsersCollection');
var UsersListComponent = require('./components/UsersListComponent');
var RegistrationsListComponent = require('./components/RegistrationsListComponent');
var TermModel = require('./models/TermModel');

$(function() {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      '/': 'index',
      'attendance': 'attendance',
      'terms': 'terms',
      'users': 'users',
      'courses': 'courses',
      'registration': 'registration'
    },
    
    currentUser: new UserModel($('[data-bootstrap]').detach().data('bootstrap')),
    currentView: undefined,
    
    initialize: function() {
      $('<div class="navbar-fixed"><nav></nav></div>').insertBefore('#container');
      ReactDOM.render(<NavbarComponent model={this.currentUser} />, $('nav')[0]);
    },
    
    attendance: function() {
      var users = new UsersCollection();
      users.fetch();
      ReactDOM.render(<AttendanceListComponent users={users} model={new UserModel()} />, $('#container')[0]);
    },
    
    index: function() {
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
