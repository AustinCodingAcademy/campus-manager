var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
require('backbone-react-component');
var UserModalComponent = require('./userModalComponent.js');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  userModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<UserModalComponent collection={this.props.collection} model={this.props.model}/>, $('#modal-container')[0]);
    $('#user-modal' + this.props.model.id).openModal();
    Materialize.updateTextFields();
  },
  
  deleteUser: function() {
    this.props.model.destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.model.get('idn')}</td>
        <td>{this.props.model.fullName()}</td>
        <td>{this.props.model.get('username')}</td>
        <td>{this.props.model.get('phone')}</td>
        <td>{this.props.model.roles()}</td>
        <td>{this.props.model.get('github')}</td>
        <td>{this.props.model.get('website')}</td>
        <td>
          <a className="waves-effect waves-teal btn-flat modal-trigger" onClick={this.userModal}>
            <i className="material-icons">mode_edit</i>
          </a>
        </td>
        <td><a className="waves-effect waves-teal btn-flat" onClick={this.deleteUser}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
