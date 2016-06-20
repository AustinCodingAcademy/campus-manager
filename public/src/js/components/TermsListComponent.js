var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var TermItemComponent = React.createFactory(require('./TermItemComponent.js'));
var TermModalComponent = React.createFactory(require('./TermModalComponent.js'));
var TermModel = require('../models/TermModel');

module.exports = React.createBackboneClass({
  newTermModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<TermModalComponent collection={this.getCollection()} model={new TermModel()} />, $('#modal-container')[0]);
    $('#term-modal').openModal();
  },

  render: function() {
    var that = this;
    var termItems = this.getCollection().map(function(termItem) {
      return <TermItemComponent key={termItem.id} model={termItem} collection={that.getCollection()}/>
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
