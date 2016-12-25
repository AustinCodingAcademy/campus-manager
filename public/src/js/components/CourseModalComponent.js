import * as React from 'react';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
const Select = require('react-select');
const TermOptionComponent = require('./TermOptionComponent');
const TermValueComponent = require('./TermValueComponent');
const LocationOptionComponent = require('./LocationOptionComponent');
const LocationValueComponent = require('./LocationValueComponent');
const LocationModel = require('../models/LocationModel');
const TermModel = require('../models/TermModel');

module.exports = React.createBackboneClass({
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
      course: this.getModel().attributes,
      days: [],
      alertVisible: 'hidden',
      error: '',
      title: this.props.title
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

  selectDays(options) {
    this.setState({ days: options });
    this.state.course.days = options.map(day => {
      return day.value;
    });
  },

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    if (e.currentTarget.getAttribute('id') === 'holidays') {
      this.state.course[attr] = e.currentTarget.value.split(',').map(holiday => {
        return holiday.trim();
      });
    } else {
      this.state.course[attr] = e.currentTarget.value;
    }
  },

  save(e) {
    e.preventDefault();
    this.getModel().save(this.state.course, {
      success: () => {
        this.props.courses.add(this.getModel(), {
          merge: true
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
      course: this.getModel().attributes,
      term: this.getModel().get('term'),
      location: this.getModel().get('location'),
      days: this.dayOptions.filter(day => {
        return this.getModel().get('days').includes(day.value);
      })
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
            <FormGroup controlId="textbook">
              <ControlLabel>Textbook URL</ControlLabel>
              <FormControl
                type="text"
                placeholder="Textbook URL"
                onChange={this.changeTextValue}
                defaultValue={this.getModel().get('textbook')}
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
            <FormGroup controlId="holidays">
              <ControlLabel>Holidays</ControlLabel>
              <FormControl
                type="text"
                placeholder="YYYY-MM-DD, YYYY-MM-DD, etc"
                onChange={this.changeTextValue}
                defaultValue={this.getModel().get('holidays').join(', ')}
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
