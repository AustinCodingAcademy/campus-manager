import * as Backbone from 'backbone';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'react.backbone';
const UserItemComponent = React.createFactory(require('./UserItemComponent'));
const UserModalComponent = React.createFactory(require('./UserModalComponent'));
const UserModel = require('../models/UserModel');

module.exports = React.createBackboneClass({

  newUserModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(UserModalComponent({
      collection: this.getCollection(),
      model: new UserModel()
    }), $('#modal-container')[0]);
    $('#user-modal').modal('open');
  },

  render: function() {
    var that = this;
    var userItems = this.getCollection().map(function(user) {
      return UserItemComponent({
        model: user,
        collection: that.getCollection(),
        key: user.id,
        currentUser: that.props.currentUser
      });
    });

    return (
      <div className="row">
        <div className="col-xs-12">
          <br />
          <a className="waves-effect waves-teal btn" onClick={this.newUserModal} data-test="new-user">
            <i className="material-icons left">add</i> user
          </a>
          <br />
          <table className="table table-striped table-condensed table-hover">
            <thead>
              <tr>
                <th>IDN</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role(s)</th>
                <th></th>
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
