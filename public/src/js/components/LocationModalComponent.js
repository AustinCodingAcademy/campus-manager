var _ = require('underscore');
var React = require('react');
require('react.backbone');
var LocationModel = require('../models/LocationModel');

module.exports = React.createBackboneClass({
  attrs: [
    'name',
    'address',
    'city',
    'state',
    'zipcode',
    'phone',
    'contact'
  ],

  componentDidMount: function() {
    _.each(this.attrs, function(attr) {
      this.refs[attr].value = this.getModel().get(attr);
    }, this);
    Materialize.updateTextFields();
    $('.modal').modal();
  },

  saveLocation: function(e) {
    e.preventDefault();
    var that = this;
    var data = {};
    _.each(this.attrs, function(attr) {
      data[attr] = this.refs[attr].value;
    }, this);
    this.getModel().save(data, {
      success: function() {
        that.getCollection().add(that.getModel());
      }
    });
  },

  deleteLocation: function(e) {
    e.preventDefault();
    var r = confirm('Are you sure you want to delete this location?');
    if (r == true) {
      this.getModel().destroy({
        wait: true,
        success: function() {
          $('.modal').modal('close');
        }
      });
    }
  },

  render: function() {
    return (
      <div className="modal" id="location-modal">
        <div className="modal-content">
          <div className="row">
            <form className="col s12" onSubmit={this.saveLocation}>
              <div className="row">
                <div className="input-field col s12 m4">
                  <input ref="name" type="text" id="name" />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="input-field col s12 m8">
                  <label htmlFor="contact">Contact</label>
                  <input ref="contact" type="text" name="contact" id="contact" />
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 m8">
                  <input ref="address" type="text" id="address" />
                  <label htmlFor="address">Address</label>
                </div>
                <div className="input-field col s12 m4">
                  <input ref="phone" type="text" id="phone" />
                  <label htmlFor="phone">Phone</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 m4">
                  <label htmlFor="city">City</label>
                  <input ref="city" type="text" name="city" id="city" />
                </div>
                <div className="input-field col s12 m4">
                  <label htmlFor="city">State</label>
                  <input ref="state" type="text" name="state" id="state" />
                </div>
                <div className="input-field col s12 m4">
                  <label htmlFor="zipcode">Zipcode</label>
                  <input ref="zipcode" type="text" name="zipcode" id="zipcode" />
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <input type="submit" className="modal-action modal-close waves-effect waves-green btn" value="Submit"/>
                  <a href="#" className="waves-effect waves-light btn red right" onClick={this.deleteLocation}><i className="fa fa-trash fa-2x"></i></a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
