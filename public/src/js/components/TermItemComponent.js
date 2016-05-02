var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
require('backbone-react-component');
var TermModalComponent = require('./TermModalComponent.js');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  termModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<TermModalComponent collection={this.props.collection} model={this.props.model}/>, $('#modal-container')[0]);
    $('#term-modal' + this.props.model.id).openModal();
    Materialize.updateTextFields();
  },
  
  deleteTerm: function() {
    this.props.model.destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.model.get('name')}</td>
        <td>{moment(this.props.model.get('start_date')).format("MMM D, YYYY")}</td>
        <td>{moment(this.props.model.get('end_date')).format("MMM D, YYYY")}</td>
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
