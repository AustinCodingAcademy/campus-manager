'use strict';

var $ = window.$ = window.jQuery = require('jquery');

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

var TermsCollection = require('./collections/termsCollection');
var TermsListComponent = require('./components/termsListComponent');
var HomeLayoutComponent = require('./components/homeLayoutComponent');
var NavbarComponent = require('./components/navbarComponent');
var UserModel = require('./models/userModel');

$(function() {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      '/': 'index',
      'terms': 'terms',
    },
    
    currentUser: new UserModel($('[data-bootstrap]').detach().data('bootstrap')),
    
    initialize: function() {
      $('<nav></nav>').insertBefore('#container');
      ReactDOM.render(<NavbarComponent model={this.currentUser} />, $('nav')[0]);
    },
    
    index: function() {
      ReactDOM.render(<HomeLayoutComponent />, $('#container')[0]);
    },
    
    terms: function() {
      var terms = new TermsCollection();
      terms.fetch();
      ReactDOM.render(<TermsListComponent collection={terms} />, $('#container')[0]);
    },
    }
  });
  
  new AppRouter();
  Backbone.history.start();
});
