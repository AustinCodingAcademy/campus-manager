var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var LocationItemComponent = React.createFactory(require('./LocationItemComponent.js'));
var LocationModalComponent = React.createFactory(require('./LocationModalComponent.js'));
var LocationModel = require('../models/LocationModel');
var TermsCollection = require('../collections/TermsCollection');

module.exports = React.createBackboneClass({
  newLocationModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(LocationModalComponent({
      collection: this.getCollection(),
      model: new LocationModel(),
    }), $('#modal-container')[0]);
    $('#location-modal').openModal();
  },

  render: function() {
    var that = this;
    var locationItems = this.getCollection().map(function(locationItem) {
      return LocationItemComponent({
        model: locationItem,
        collection: that.getCollection()
      });
    });

    return (
      <div className="row">
        <div className="col s12">
          <br />
          <a className="waves-effect waves-teal btn modal-trigger" onClick={this.newLocationModal} data-test="new-location"><i className="material-icons left">add</i> location</a>
          <br />
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Phone</th>
                <th>Contact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {locationItems}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});
