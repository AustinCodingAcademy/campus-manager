import * as React from 'react';
import * as Backbone from 'backbone';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
import Select from 'react-select';
import UserOptionComponent from './UserOptionComponent';
import UserValueComponent from './UserValueComponent';
import CourseOptionComponent from './CourseOptionComponent';
import CourseValueComponent from './CourseValueComponent';
import UserModel from '../models/UserModel';
import CourseModel from '../models/CourseModel';

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      course: new CourseModel(),
      user: new UserModel(),
      alertVisible: 'hidden',
      error: ''
    }
  },

  setUserValue(option) {
    this.setState({ user: option.user });
  },

  setCourseValue(option) {
    this.setState({ course: option.course });
  },

  save(e) {
    e.preventDefault();
    const course = this.getCollection().get(this.state.course);
    if (this.state.user.id) {
      Backbone.$.ajax('/api/registrations', {
        method: 'POST',
        data: {
          courseId: course.id,
          userId: this.state.user.id
        },
        success: () => {
          course.get('registrations').push(this.state.user);
          this.props.onHide();
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      course: new CourseModel(),
      user: new UserModel(),
      alertVisible: 'hidden',
      error: ''
    });
  },

  render() {
    const userOptions = this.props.users.map(user => {
      return {
        value: user.id,
        label: `${user.fullName()} ${user.get('username')} ${user.get('phone')}`,
        user: user
      };
    });

    const courseOptions = this.getCollection().map(course => {
      return {
        value: course.id,
        label: course.get('name') +
        course.get('location').get('name') +
        course.get('location').get('address') +
        course.get('location').get('city') +
        course.get('location').get('state') +
        course.get('location').get('zipcode') +
        course.get('term').get('name'),
        course: course
      };
    });

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>New Registration</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.save}>
          <Modal.Body>
            <Alert className={this.state.alertVisible} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
              <p>{this.state.error}</p>
            </Alert>
            <FormGroup controlId="user">
              <ControlLabel>User</ControlLabel>
              <Select
                options={userOptions}
                optionComponent={UserOptionComponent}
                placeholder="Type to search..."
                valueComponent={UserValueComponent}
                value={this.state.user.id}
                onChange={this.setUserValue}
              />
            </FormGroup>
            <FormGroup controlId="course">
              <ControlLabel>Course</ControlLabel>
              <Select
                options={courseOptions}
                optionComponent={CourseOptionComponent}
                placeholder="Type to search..."
                valueComponent={CourseValueComponent}
                value={this.state.course.id}
                onChange={this.setCourseValue}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit" block onClick={this.save}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});
