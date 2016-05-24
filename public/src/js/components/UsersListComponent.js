var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
require('backbone-react-component');
var UserItemComponent = require('./UserItemComponent');
var UserModalComponent = require('./UserModalComponent');
var UserModel = require('../models/UserModel');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],

  newUserModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<UserModalComponent collection={this.props.collection} model={new UserModel()}/>, $('#modal-container')[0]);
    $('#user-modal').openModal();
  },

  render: function() {
    var that = this;
    var userItems = this.props.collection.map(function(user) {
      return <UserItemComponent key={user.id} model={user} collection={that.props.collection}/>
    });

    return (
      <div className="row">
        <div className="col s12">
          <br />
          <a className="waves-effect waves-teal btn modal-trigger" onClick={this.newUserModal}><i className="material-icons left">add</i> user</a>
          <br />
          <table>
            <thead>
              <tr>
                <th>IDN</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role(s)</th>
              </tr>
            </thead>
            <tbody>
              {userItems}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});
