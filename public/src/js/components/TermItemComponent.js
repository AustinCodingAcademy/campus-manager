var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
require('react.backbone');
var TermModalComponent = React.createFactory(require('./TermModalComponent.js'));

module.exports = React.createBackboneClass({
  termModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(TermModalComponent({
      collection: this.props.collection,
      model: this.getModel()
    }), $('#modal-container')[0]);
    $('#term-modal' + this.getModel().id).openModal();
    Materialize.updateTextFields();
  },

  deleteTerm: function() {
    this.getModel().destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.getModel().get('name')}</td>
        <td>{moment(this.getModel().get('start_date')).format("MMM D, YYYY")}</td>
        <td>{moment(this.getModel().get('end_date')).format("MMM D, YYYY")}</td>
        <td>
          <a className="waves-effect waves-teal btn-flat modal-trigger" onClick={this.termModal}>
            <i className="material-icons">mode_edit</i>
          </a>
        </td>
        <td><a className="waves-effect waves-teal btn-flat" onClick={this.deleteTerm}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
