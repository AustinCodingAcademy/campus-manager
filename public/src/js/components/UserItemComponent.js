var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var UserModalComponent = require('./UserModalComponent.js');

module.exports = React.createBackboneClass({
  userModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<UserModalComponent collection={this.getCollection()} model={this.getModel()} currentUser={this.props.currentUser}/>, $('#modal-container')[0]);
    $('#user-modal' + this.getModel().id).modal('open');
  },

  render: function() {
    return (
      <tr>
        <td>
          <a href={'#users/' + this.getModel().id}>{this.getModel().fullName()}</a>
        </td>
        <td><a href={'mailto:' + this.getModel().get('username')} target="_blank">{this.getModel().get('username')}</a></td>
        <td>{this.getModel().roles()}</td>
        <td>
          <a className="waves-effect waves-teal btn-flat" onClick={this.userModal}>
            <i className="material-icons">mode_edit</i>
          </a>
        </td>
      </tr>
    );
  }
});
