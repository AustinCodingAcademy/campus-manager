import * as React from 'react';
import * as Backbone from 'backbone';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { Col, Row, Button, FormControl } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const RegistrationModalComponent = require('./RegistrationModalComponent');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      filterBy: '',
      alertVisible: false
    }
  },

  delete(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this registration?')) {
      const course = this.getCollection().get(e.currentTarget.getAttribute('data-course-id'));
      const userId = e.currentTarget.getAttribute('data-user-id');
      Backbone.$.ajax('/api/registrations', {
        method: 'DELETE',
        data: {
          courseId: course.id,
          userId
        },
        success: () => {
          course.get('registrations').remove(userId);
          this.getCollection().trigger('remove');
        },
        error: (model, res) => {
          this.setState({
            error: res.responseJSON.message,
            alertVisible: ''
          });
        }
      });
    }
  },

  handleAlertDismiss() {
    this.setState({ alertVisible: 'hidden' });
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

  open(e) {
    e.preventDefault();
    this.setState({
      showModal: true
    });
  },

  close() {
    this.setState({ showModal: false });
  },

  render: function() {
    const registrationRows = [];
    this.getCollection().each(course => {
      course.get('registrations').each(user => {
        registrationRows.push(
          <Tr key={`${course.id}-${user.id}`}>
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
            <Td column="Course">{course.get('name')}</Td>
            <Td column="Term">{course.get('term').get('name')}</Td>
            <Td column="delete">
              <a href="#" onClick={this.delete} data-course-id={course.id} data-user-id={user.id} className="link-danger">
                <FontAwesome name='trash-o' />
              </a>
            </Td>
          </Tr>
        );
      });
    });

    return (
      <Row>
        <Col xs={12}>
          <h3>
            Registrations
            <small>
              <a href="#" className="pull-right" onClick={this.open}>
                <FontAwesome name='plus' />
                &nbsp;Registration
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
              filterable={['IDN', 'Name', 'Email', 'Phone', 'Course', 'Term']}
              sortable={['IDN', 'Name', 'Email', 'Course', 'Term']}
              filterBy={this.state.filterBy}
            >
              <Thead>
                <Th>IDN</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Course</Th>
                <Th>Term</Th>
                <Th>delete</Th>
              </Thead>
              {registrationRows}
            </Table>
          </div>
          <RegistrationModalComponent
            show={this.state.showModal}
            onHide={this.close}
            collection={this.getCollection()}
            users={this.props.users}
          />
        </Col>
      </Row>
    );
  }
});
