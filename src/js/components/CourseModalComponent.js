import * as React from 'react';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
import Select from 'react-select';
const TermOptionComponent = require('./TermOptionComponent');
const TermValueComponent = require('./TermValueComponent');
const LocationOptionComponent = require('./LocationOptionComponent');
const LocationValueComponent = require('./LocationValueComponent');
const LocationModel = require('../models/LocationModel');
const TermModel = require('../models/TermModel');
const TextbookModel = require('../models/TextbookModel');
const CourseModel = require('../models/CourseModel');

module.exports = React.createBackboneClass({
  mixins: [
    React.BackboneMixin('terms', 'update'),
    React.BackboneMixin('locations', 'update'),
    React.BackboneMixin('textbooks', 'update')
  ],

  dayOptions:[
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ],

  getInitialState() {
    return {
      location: new LocationModel(),
      term: new TermModel(),
      textbook: new TextbookModel(),
      course: this.getModel().attributes,
      days: [],
      alertVisible: 'hidden',
      error: '',
      title: this.props.title,
      instructors: [],
      userOptions: []
    }
  },

  setLocationValue(option) {
    const location = option.location || this.getModel().get('location');
    this.setState({ location });
    this.state.course.location = location;
  },

  setTermValue(option) {
    const term = option.term || this.getModel().get('term');
    this.setState({ term });
    this.state.course.term = term;
  },

  setTextbookValue(option) {
    const textbook = this.props.textbooks.get(option.value) || this.getModel().get('textbook');
    this.setState({ textbook });
    this.state.course.textbook = textbook;
  },

  selectDays(options) {
    this.setState({ days: options });
    this.state.course.days = options.map(day => {
      return day.value;
    });
  },

  changeTextValue(e) {
    this.state.course[e.currentTarget.getAttribute('id')] = e.currentTarget.value;
  },

  changeTextbookValue(e) {
    this.state.course.textbook = this.props.textbooks.get(e.currentTarget.value);
  },

  selectInstructors(options) {
    this.setState({ instructors: options });
    const idArr = options.map(option => option.value);
    const newCourseValue = Object.assign({}, this.state.course, { instructors: idArr });
    this.setState({ course: newCourseValue });
  },

  save(e) {
    e.preventDefault();
    this.getModel().save(this.state.course, {
      success: () => {
        this.props.courses.add(this.getModel(), {
          merge: true
        });
        this.props.listComponent.setState({
          course: new CourseModel()
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
    if (confirm('Are you sure you want to delete this course?')) {
      this.getModel().destroy({
        success: () => {
          this.props.courses.remove(this.getModel());
          this.props.listComponent.setState({
            course: new CourseModel()
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
    const userOptions = this.props.users.models.map(user => {
      return {
        value: user.id,
        label: `${user.fullName()} ${user.get("username")} ${user.get(
          "phone"
        )}`,
        user: user
      };
    })
      .filter(e => e.user.attributes.is_instructor === true);
    this.setState({
      title: nextProps.title,
      course: this.getModel().attributes,
      term: this.getModel().get('term'),
      location: this.getModel().get('location'),
      textbook: this.getModel().get('textbook'),
      days: this.dayOptions.filter(day => {
        return this.getModel().get('days').includes(day.value);
      }),
      instructors: userOptions.filter(user => {
        return this.getModel()
          .get("instructors")
          .map(e => e._id)
          .includes(user.value);
      }),
      userOptions
    });
  },

  render() {
    const termOptions = this.props.terms.map(term => {
      return {
        value: term.id,
        label: term.get('name'),
        term: term
      };
    });

    const locationOptions = this.props.locations.map(location => {
      return {
        value: location.id,
        label: location.get('name') +
        location.get('address') +
        location.get('city') +
        location.get('state') +
        location.get('zipcode'),
        location: location
      };
    });

    const textbookOptions = this.props.textbooks.map(textbook => {
      return (<option key={textbook.id} value={textbook.id}>{textbook.get('name')}</option>)
    });

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
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
                defaultValue={this.getModel().get('name')}
              />
            </FormGroup>
            <FormGroup controlId="section">
              <ControlLabel>Section</ControlLabel>
              <FormControl
                type="number"
                onChange={this.changeTextValue}
                defaultValue={this.getModel().get('section')}
              />
            </FormGroup>
            <FormGroup controlId="textbook">
              <ControlLabel>Textbook</ControlLabel>
              <Select
                name="textbooks"
                value={this.state.textbook.id}
                options={this.props.textbooks.map(textbook => { return { value: textbook.id, label: textbook.get('name')}; })}
                onChange={this.setTextbookValue}
                placeholder="Type to search..."
              />
           </FormGroup>
            <FormGroup controlId="cost">
              <ControlLabel>Cost</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="0.00"
                  onChange={this.changeTextValue}
                  defaultValue={Number(this.getModel().get('cost')).toFixed(2)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup controlId="seats">
              <ControlLabel>Seats</ControlLabel>
              <FormControl
                type="number"
                placeholder="0"
                onChange={this.changeTextValue}
                defaultValue={this.getModel().get('seats')}
              />
            </FormGroup>
            <FormGroup controlId="term">
              <ControlLabel>Term</ControlLabel>
              <Select
                options={termOptions}
                optionComponent={TermOptionComponent}
                placeholder="Type to search..."
                valueComponent={TermValueComponent}
                value={this.state.term.id}
                onChange={this.setTermValue}
              />
            </FormGroup>
            <FormGroup controlId="location">
              <ControlLabel>Location</ControlLabel>
              <Select
                options={locationOptions}
                optionComponent={LocationOptionComponent}
                placeholder="Type to search..."
                valueComponent={LocationValueComponent}
                value={this.state.location.id}
                onChange={this.setLocationValue}
              />
            </FormGroup>
            <FormGroup controlId="days">
              <ControlLabel>Days</ControlLabel>
              <Select
                name="days"
                value={this.state.days}
                options={this.dayOptions}
                onChange={this.selectDays}
                multi={true}
              />
            </FormGroup>
            <FormGroup controlId="timeStart">
              <ControlLabel>Time Start</ControlLabel>
              <FormControl
                type="time"
                onChange={this.changeTextValue}
                defaultValue={this.getModel().get('timeStart')}
              />
            </FormGroup>
            <FormGroup controlId="timeEnd">
              <ControlLabel>Time End</ControlLabel>
              <FormControl
                type="time"
                onChange={this.changeTextValue}
                defaultValue={this.getModel().get('timeEnd')}
              />
            </FormGroup>
            <FormGroup controlId="note">
              <ControlLabel>Note</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Note..."
                onChange={this.changeTextValue}
                defaultValue={this.getModel().get('note')}
              />
            </FormGroup>
            <FormGroup controlId="instructors">
              <ControlLabel>Instructors</ControlLabel>
              <Select
                name="instructors"
                value={this.state.instructors}
                options={this.state.userOptions}
                onChange={this.selectInstructors}
                multi={true}
              />
            </FormGroup>
            <a href="#" className="link-danger" onClick={this.delete}>Delete Course</a>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit" block onClick={this.save}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});
