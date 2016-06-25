var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var UserModalComponent = require('./UserModalComponent.js');

module.exports = React.createBackboneClass({
  userModal: function(e) {
    e.preventDefault();
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<UserModalComponent collection={this.getCollection()} model={this.getModel()}/>, $('#modal-container')[0]);
    $('#user-modal' + this.getModel().id).openModal();
    Materialize.updateTextFields();
  },

  render: function() {
    return (
      <tr>
        <td>
          <a href={'#users/' + this.getModel().id}>{this.getModel().fullName()}</a>
        </td>
        <td><a href={'mailto:' + this.getModel().get('username')} target="_blank">{this.getModel().get('username')}</a></td>
        <td className={'score' + this.getModel().get('gradeAverage')}>{this.getModel().get('gradeAverage')}</td>
        <td>{this.getModel().roles()}</td>
        <td>
          <a href="#" className="modal-trigger" onClick={this.userModal}>
            <i className="fa fa-pencil fa-2x"></i>
          </a>
        </td>
      </tr>
    );
  }
});
