var Backbone = require('backbone');
var React = require('react');
var moment = require('moment');
require('backbone-react-component');
var TermModalComponent = require('./termModalComponent.js');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  termModal: function() {
    $('#term-modal' + this.props.model.id).openModal();
  },
  
  deleteTerm: function() {
    this.props.model.destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.state.model.name}</td>
        <td>{moment(this.state.model.start_date).format("MMM D, YYYY")}</td>
        <td>{moment(this.state.model.end_date).format("MMM D, YYYY")}</td>
        <td>
          <a className="waves-effect waves-teal btn-flat modal-trigger" onClick={this.termModal}>
            <i className="material-icons">mode_edit</i>
          </a>
          <TermModalComponent collection={this.props.collection} model={this.props.model}/>
        </td>
        <td><a className="waves-effect waves-teal btn-flat" onClick={this.deleteTerm}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
