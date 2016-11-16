var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var TermItemComponent = React.createFactory(require('./TermItemComponent.js'));
var TermModalComponent = React.createFactory(require('./TermModalComponent.js'));
var TermModel = require('../models/TermModel');

module.exports = React.createBackboneClass({
  newTermModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(TermModalComponent({
      collection: this.getCollection(),
      model: new TermModel()
    }), $('#modal-container')[0]);
    $('#term-modal').modal('open');
  },

  render: function() {
    var termItems = this.getCollection().map(function(termItem) {
      return TermItemComponent({
        key: termItem.id,
        model: termItem,
        collection: this.getCollection()
      })
    }, this);

    return (
      <div className="row">
        <div className="col s12">
          <br />
          <a className="waves-effect waves-teal btn" onClick={this.newTermModal} data-test="new-term"><i className="material-icons left">add</i> term</a>
          <br />
          <table className="striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Dates</th>
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
