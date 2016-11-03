var _ = require('underscore');
var React = require('react');
require('react.backbone');
var UserModel = require('../models/UserModel');

module.exports = React.createBackboneClass({

  getInitialState: function () {
    return {model: this.getModel().attributes};
  },

  componentDidMount: function() {
    $('.modal').modal();
  },

  // On input change update the state with the given
  // attribute and value retreived from the event
  handleInputChange: function(attr, evt) {
    var model = this.state.model;
    model[attr] = evt.target.value;

    this.setState({model: model});
  },

  // When a check box is clicked, toggle the state for the corosponding box
  handleToggleCheck: function(attr) {
    var model = this.state.model;
    model[attr] = !this.state.model[attr];

    this.setState({model: model});
  },

  saveUser: function(e) {
    e.preventDefault();
    var that = this;

    this.getModel().save(this.state.model, {
      success: function (user) {
        $('#' + 'user-modal' + (that.getModel().id || '')).modal('close');
        if (that.getCollection()) {
          that.getCollection().add(user);
        }
        user.trigger('change');
      }
    });
  },

  deleteUser: function(e) {
    e.preventDefault();
    var that = this;
    var r = confirm('Are you sure you want to delete this user?');
    if (r == true) {
      this.getModel().destroy({
        wait: true,
        success: function() {
          $('#' + 'user-modal' + (that.getModel().id || '')).modal('close');
        }
      });
    }
  },

  render: function() {
    var that = this;

    var rolesHidden = this.props.rolesHidden? 'hidden': '';

    return (
      <div id={'user-modal' + (this.state.model._id || '')} className="modal">
        <div className="modal-content">

          <div className="row">
            <form className="col s12" onSubmit={this.saveUser}>

              <div className={"row " + rolesHidden}>

                {/* Is Admin Check Box */}
                <div className="col s12 m4">
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
                <div className="col s12 m4">
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
                <div className="col s12 m4">
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
                  <label htmlFor="first-name">First Name (required)</label>
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
                  <label htmlFor="last-name">Last Name (required)</label>
                </div>

              </div>

              <div className="row">

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
                  <label htmlFor="username">Email (required)</label>
                </div>

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
                  <label htmlFor="github">Github Username</label>
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
                  <label htmlFor="website">Website (ex. <i>http:&#47;&#47;example.com</i>)</label>
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
                  <label htmlFor="codecademy">Codecademy Username</label>
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
              <div className={"row " + rolesHidden}>

                <div className="input-field col s12">
                  <input
                    type="text"
                    id="credits"
                    value={this.state.model.credits}
                    onChange={function(evt) {
                      that.handleInputChange('credits', evt);
                    }}
                    placeholder="description:100.00, some scholarship:30.00"/>
                  <label htmlFor="credits">Credits</label>
                </div>

              </div>

              {/* Submit Button */}
              <input
                type="submit"
                className="modal-action waves-effect waves-green btn"
                value="Submit"/>

              <a href="#" className={ rolesHidden + ' waves-effect waves-light btn red right'} onClick={this.deleteUser}><i className="fa fa-trash fa-2x"></i></a>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
