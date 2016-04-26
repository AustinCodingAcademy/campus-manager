var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
require('backbone-react-component');
var TermItemComponent = require('./termItemComponent.js');
var TermModalComponent = require('./termModalComponent.js');
var TermModel = require('../models/termModel');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],

  newTermModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<TermModalComponent collection={this.props.collection} model={new TermModel()} />, $('#modal-container')[0]);
    $('#term-modal').openModal();
  },

  render: function() {
    var that = this;
    var termItems = this.props.collection.map(function(termItem) {
      return <TermItemComponent key={termItem.id} model={termItem} collection={that.props.collection}/>
    });

    return (
      <div className="row">
        <div className="col s12">
          <br />
          <a className="waves-effect waves-teal btn modal-trigger" onClick={this.newTermModal}><i className="material-icons left">add</i> term</a>
          <br />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {termItems}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});
