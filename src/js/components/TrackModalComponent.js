import * as React from 'react';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
const Select = require('react-select');
import ReactPhoneInput from 'react-phone-input';
const TrackModel = require('../models/TrackModel');
const CourseOptionComponent = require('./CourseOptionComponent');
const CourseValueComponent = require('./CourseValueComponent');

module.exports = React.createBackboneClass({
  mixins: [
    React.BackboneMixin('courses', 'update')
  ],

  getInitialState() {
    return {
      track: this.getModel().attributes,
      alertVisible: 'hidden',
      error: '',
      title: this.props.title,
      courses: []
    }
  },

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    this.state.track[attr] = e.currentTarget.value;
  },

  save(e) {
    e.preventDefault();
    const track = {
      name: this.state.track.name,
      courses: this.state.track.courses.pluck('_id')
    }
    this.getModel().save(track, {
      success: () => {
        this.props.tracks.add(this.getModel(), {
          merge: true
        });
        this.props.listComponent.setState({
          track: new TrackModel()
        });
        this.props.onHide();
      },
      error: (model, res) => {
        this.setState({
          error: res.responseJSON.message,
          alertVisible: ''
        });
      }
    });
  },

  delete(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this track?')) {
      this.getModel().destroy({
        success: () => {
          this.props.tracks.remove(this.getModel());
          this.props.listComponent.setState({
            track: new TrackModel()
          });
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.title,
      track: this.getModel().attributes
    });
  },

  handleAlertDismiss() {
    this.setState({ alertVisible: 'hidden' });
  },

  selectCourses(options) {
    const courses = options.map(option => {
      return option.course;
    });
    this.setState({ courses: options });
    this.getModel().get('courses').set(courses);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.title,
      track: this.getModel().attributes,
      courses: this.courseOptions(this.getModel().get('courses'))
    });
  },

  courseOptions(courses) {
    const courseOptions = [];

    courses.each(course => {
      const label = `
      ${course.get('term').get('name')}
      ${course.get('name')}
      ${course.get('location').get('name')}
      ${course.get('location').get('address')}
      ${course.get('location').get('city')}
      ${course.get('location').get('state')}
      ${course.get('location').get('zipcode')}`;
      courseOptions.push({
        value: course.id,
        label,
        course,
        user: this.getModel()
      });
    });
    return courseOptions;
  },

  render: function() {

    const courseOptions = this.courseOptions(this.props.courses);

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.save}>
          <Modal.Body>
            <Alert className={this.state.alertVisible} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
              <p>{this.state.error}</p>
            </Alert>
            <FormGroup controlId="name">
              <ControlLabel>Name</ControlLabel>
              <FormControl
                type="text"
                placeholder="Name"
                onChange={this.changeTextValue}
                defaultValue={this.state.track.name}
              />
            </FormGroup>
            <FormGroup controlId="courses">
              <ControlLabel>Courses</ControlLabel>
              <Select
                options={courseOptions}
                optionComponent={CourseOptionComponent}
                placeholder="Type to search..."
                valueComponent={CourseValueComponent}
                value={this.state.courses}
                onChange={this.selectCourses}
                multi={true}
              />
            </FormGroup>
            <a href="#" className="link-danger" onClick={this.delete}>Delete Track</a>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit" block onClick={this.save}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});
