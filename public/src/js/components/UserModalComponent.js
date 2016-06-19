var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var moment = require('moment');
require('react.backbone');
var UserModel = require('../models/UserModel');

module.exports = React.createBackboneClass({
   

  // On input change update the state with the given
  // attribute and value retreived from the event
  handleInputChange: function(attr, evt) {
    var model = this.state.model;
    model[attr] = evt.target.value;

    this.setState({model: model});
  },

  // When a check box is clicked, toggle the state for the corosponding box
  handleToggleCheck(attr) {
    var model = this.state.model;
    model[attr] = !this.state.model[attr];

    this.setState({model: model});
  },

  saveUser: function(e) {
    e.preventDefault();
    var that = this;

    this.getModel().save(this.state.model, {
      success: function (user) {
         $('#' + 'user-modal' + (that.props.model.id || '')).closeModal();
        if (that.props.collection) {
          that.props.collection.add(user);
        }
      }
    });
  },

  render: function() {
    var that = this;

    var rolesHidden = this.props.rolesHidden? 'hidden': '';

    return (
      <div id={'user-modal' + (this.getModel().id || '')} className="modal">
        <div className="modal-content">

          <div className="row">
            <form className="col s12" onSubmit={this.saveUser}>

              <div className={"row " + rolesHidden}>

                {/* IDN Input Field */}
                <div className="input-field col s12 m3">
                  <input
                    type="text"
                    id="idn"
                    value={this.state.model.idn}
                    onChange={function(evt) {
                      that.handleInputChange('idn', evt);
                    }}/>
                  <label htmlFor="idn">IDN</label>
                </div>

                {/* Is Admin Check Box */}
                <div className="col s12 m3">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={this.state.model.is_admin ? 'checked' : ''}
                    onChange={function() {
                      that.handleToggleCheck('is_admin');
                    }} />
                  <label htmlFor="is_admin">Admin</label>
                </div>

                {/* Is Instructor Check Box */}
                <div className="col s12 m3">
                  <input
                    type="checkbox"
                    id="is_instructor"
                    checked={this.state.model.is_instructor ? 'checked' : ''}
                    onChange={function() {
                      that.handleToggleCheck('is_instructor');
                    }} />
                  <label htmlFor="is_instructor">Instructor</label>
                </div>

                {/* Is Student Check Box */}
                <div className="col s12 m3">
                  <input
                    type="checkbox"
                    id="is_student"
                    checked={this.state.model.is_student ? 'checked' : ''}
                    onChange={function() {
                      that.handleToggleCheck('is_student');
                    }} />
                  <label htmlFor="is_student">Student</label>
                </div>
              </div>

              <div className="row">

                {/* First Name Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="text"
                    id="first-name"
                    value={this.state.model.first_name}
                    onChange={function(evt) {
                      that.handleInputChange('first_name', evt);
                    }}/>
                  <label htmlFor="first-name">First Name</label>
                </div>

                {/* Last Name Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="text"
                    id="last-name"
                    value={this.state.model.last_name}
                    onChange={function(evt) {
                      that.handleInputChange('last_name', evt);
                    }}/>
                  <label htmlFor="last-name">Last Name</label>
                </div>

              </div>

              <div className="row">

                {/* Phone Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="text"
                    id="phone"
                    value={this.state.model.phone}
                    onChange={function(evt) {
                      that.handleInputChange('phone', evt);
                    }}/>
                  <label htmlFor="phone">Phone</label>
                </div>

                {/* Email Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="email"
                    className="validate"
                    id="username"
                    value={this.state.model.username}
                    onChange={function(evt) {
                      that.handleInputChange('username', evt);
                    }}/>
                  <label htmlFor="username">Email</label>
                </div>

              </div>

              <div className="row">

                {/* Github Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="text"
                    id="github"
                    value={this.state.model.github}
                    onChange={function(evt) {
                      that.handleInputChange('github', evt);
                    }}/>
                  <label htmlFor="github">Github</label>
                </div>


                {/* Website Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="text"
                    id="website"
                    value={this.state.model.website}
                    onChange={function(evt) {
                      that.handleInputChange('website', evt);
                    }}/>
                  <label htmlFor="website">Website</label>
                </div>

              </div>

              <div className="row">

                {/* Website Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="text"
                    id="codecademy"
                    value={this.state.model.codecademy}
                    onChange={function(evt) {
                      that.handleInputChange('codecademy', evt);
                    }}/>
                  <label htmlFor="codecademy">Codecademy</label>
                </div>

                {/* Website Input */}
                <div className="input-field col s12 m6">
                  <input
                    type="text"
                    id="zipcode"
                    value={this.state.model.zipcode}
                    onChange={function(evt) {
                      that.handleInputChange('zipcode', evt);
                    }}/>
                  <label htmlFor="zipcode">Zipcode</label>
                </div>

              </div>

              {/* Submit Button */}
              <input
                type="submit"
                className="modal-action waves-effect waves-green btn"
                value="Submit"/>

            </form>
          </div>
        </div>
      </div>
    );
  }
});
