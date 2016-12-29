import * as Backbone from 'backbone';
import * as React from 'react';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { Col, Row, Button, FormControl } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const UserModalComponent = require('./UserModalComponent');
const UserModel = require('../models/UserModel');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      user: new UserModel(),
      modalTitle: 'New User',
      filterBy: ''
    }
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    const user = this.getCollection().get(e.currentTarget.getAttribute('data-id')) || new UserModel();
    this.state.user.clear().set(user.attributes);
    this.setState({
      showModal: true,
      modalTitle: user.id ? 'Edit User' : 'New User'
    });
  },

  show(e) {
    e.preventDefault();
    Backbone.history.navigate('users/' + e.currentTarget.getAttribute('data-id'), true);
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  render() {
    const userRows = this.getCollection().map(user => {
      return (
        <Tr key={user.id}>
          <Td column="IDN">{user.get('idn')}</Td>
          <Td column="Name" value={user.fullName()}>
            <a href="#" onClick={this.show} data-id={user.id}>{user.fullName()}</a>
          </Td>
          <Td column="Email" value={user.get('username')}>
            <div>
              <a href={`mailto:${user.get('username')}`} target="_blank">{user.get('username')}</a>
            </div>
          </Td>
          <Td column="Phone">{user.get('phone')}</Td>
          <Td column="Roles">{user.roles().join(', ')}</Td>
          <Td column="edit">
            <a href="#" onClick={this.open} data-id={user.id}>
              <FontAwesome name='pencil' />
            </a>
          </Td>
        </Tr>
      );
    });

    return (
      <Row>
        <Col xs={12}>
          <h3>
            Users
            <small>
              <a href="#" className="pull-right" onClick={this.open}>
                <FontAwesome name='plus' />
                &nbsp;User
              </a>
            </small>
          </h3>
          <FormControl
            type="text"
            placeholder="Filter..."
            onChange={this.changeFilterValue}
            defaultValue={this.state.filterBy}
          />
          <br />
          <div className="x-scroll">
            <Table
              className="table table-condensed table-striped"
              itemsPerPage={20}
              filterable={['IDN', 'Name', 'Email', 'Phone', 'Roles']}
              sortable={['IDN', 'Name', 'Email']}
              filterBy={this.state.filterBy}
            >
              <Thead>
                <Th>IDN</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Roles</Th>
                <Th>edit</Th>
              </Thead>
              {userRows}
            </Table>
          </div>
          <UserModalComponent
            show={this.state.showModal}
            onHide={this.close}
            users={this.getCollection()}
            model={this.state.user}
            title={this.state.modalTitle}
            currentUser={this.props.currentUser}
          />
        </Col>
      </Row>
    );
  }
});
