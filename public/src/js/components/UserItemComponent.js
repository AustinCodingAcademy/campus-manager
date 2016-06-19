var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var UserModalComponent = require('./UserModalComponent.js');

module.exports = React.createBackboneClass({
  userModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<UserModalComponent collection={this.props.collection} model={this.getModel()}/>, $('#modal-container')[0]);
    $('#user-modal' + this.getModel().id).openModal();
    Materialize.updateTextFields();
  },

  deleteUser: function() {
    this.getModel().destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.getModel().get('idn')}</td>
        <td><a href={'#users/' + this.getModel().id}>{this.getModel().fullName()}</a></td>
        <td><a href={'mailto:' + this.getModel().get('username')} target="_blank">{this.getModel().get('username')}</a></td>
        <td style={{whiteSpace: 'nowrap'}}>{this.getModel().get('phone')}</td>
        <td>{this.getModel().roles()}</td>
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
