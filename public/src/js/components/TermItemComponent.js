var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
require('react.backbone');
var TermModalComponent = React.createFactory(require('./TermModalComponent.js'));

module.exports = React.createBackboneClass({
  termModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(TermModalComponent({
      collection: this.getCollection(),
      model: this.getModel(),
      locations: this.props.locations
    }), $('#modal-container')[0]);
    $('#term-modal' + this.getModel().id).modal('open');
    Materialize.updateTextFields();
  },

  render: function() {
    return (
      <tr>
        <td>{this.getModel().get('name')}</td>
        <td>{moment.utc(this.getModel().get('start_date')).format("MMM D, YYYY") + ' - ' + moment.utc(this.getModel().get('end_date')).format("MMM D, YYYY")}</td>
        <td>{this.getModel().get('location') ? this.getModel().get('location').get('name') : ''}</td>
        <td>
          <a className="waves-effect waves-teal btn-flat modal-trigger" onClick={this.termModal}>
            <i className="material-icons">mode_edit</i>
          </a>
        </td>
      </tr>
    );
  }
});
