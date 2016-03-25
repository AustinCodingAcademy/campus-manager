var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var moment = require('moment');
require('backbone-react-component');
var UserModel = require('../models/userModel');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  attributes: [
    'idn',
    'username',
    'first_name',
    'last_name',
    'phone',
    'website',
    'github',
    'is_admin',
    'is_instructor',
    'is_student'
  ],

  componentDidMount: function() {
    _.each(this.attributes, function (attr) {
      this.refs[attr].value = this.props.model.get(attr);
    }, this);
  },
  
  toggleCheck(e) {
    e.preventDefault();
    var attr = $(e.target).attr('id');
    this.props.model.set(attr, !JSON.parse($(e.target).val()));
  },
  
  saveUser: function(e) {
    e.preventDefault();
    var that = this;
    
    var attrs = {};
    _.each(this.attributes, function(attr) {
      attrs[attr] = that.refs[attr].value
    });
    
    this.props.model.save(attrs, {
      success: function (user) {
        that.props.collection.add(user);
      }
    });
  },

  render: function() {
    isAdmin = this.props.model.get('is_admin');
    isInstructor = this.props.model.get('is_instructor');
    isStudent = this.props.model.get('is_student');
    
    return (
      <div id={'user-modal' + (this.props.model.id || '')} className="modal">
        <div className="modal-content">
          <div className="row">
            <form className="col s12" onSubmit={this.saveUser}>
              <div className="row">
                <div className="input-field col s12 m3">
                  <input ref="idn" type="text" id="idn" />
                  <label htmlFor="idn">IDN</label>
                </div>
                <div className="col s12 m3">
                  <input type="checkbox" ref="is_admin" id="is_admin" value={isAdmin.toString()} checked={isAdmin ? 'checked' : ''} onChange={this.toggleCheck} />
                  <label htmlFor="is_admin">Admin</label>
                </div>
                <div className="col s12 m3">
                  <input type="checkbox" ref="is_instructor" id="is_instructor" value={isInstructor.toString()} checked={isInstructor ? 'checked' : ''} onChange={this.toggleCheck} />
                  <label htmlFor="is_instructor">Instructor</label>
                </div>
                <div className="col s12 m3">
                  <input type="checkbox" ref="is_student" id="is_student" value={isStudent.toString()} checked={isStudent ? 'checked' : ''} onChange={this.toggleCheck} />
                  <label htmlFor="is_student">Student</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 m6">
                  <input ref="first_name" type="text" id="first-name" />
                  <label htmlFor="first-name">First Name</label>
                </div>
                <div className="input-field col s12 m6">
                  <input ref="last_name" type="text" id="last-name" />
                  <label htmlFor="last-name">Last Name</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 m6">
                  <input ref="phone" type="text" id="phone" />
                  <label htmlFor="phone">Phone</label>
                </div>
                <div className="input-field col s12 m6">
                  <input ref="username" type="text" id="username" />
                  <label htmlFor="username">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 m6">
                  <input ref="github" type="text" id="github" />
                  <label htmlFor="github">Github</label>
                </div>
                <div className="input-field col s12 m6">
                  <input ref="website" type="text" id="website" />
                  <label htmlFor="website">Website</label>
                </div>
              </div>
              <input type="submit" className="modal-action modal-close waves-effect waves-green btn" value="Submit"/>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
