import * as React from 'react';
import 'react.backbone';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
const DatePicker = require('react-datepicker');
const TermModel = require('../models/TermModel');
const moment = require('moment');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      term: this.getModel().attributes,
      alertVisible: 'hidden',
      error: '',
      title: this.props.title,
      startDate: moment(),
      endDate: moment(),
    }
  },

  save(e) {
    e.preventDefault();
    this.getModel().save(this.state.user, {
      success: () => {
        this.props.terms.add(this.getModel(), {
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

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    this.state.term[attr] = e.currentTarget.value;
  },

  handleAlertDismiss() {
    this.setState({ alertVisible: 'hidden' });
  },

  handleStartDateChange(date) {
    this.setState({
      startDate: date
    });
    this.state.term.start_date = date.toISOString();
  },

  handleEndDateChange(date) {
    this.setState({
      endDate: date
    });
    this.state.term.end_date = date.toISOString();
  },

  delete(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this term?')) {
      this.getModel().destroy({
        success: () => {
          this.props.terms.remove(this.getModel());
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
      term: this.getModel().attributes,
      startDate: moment.utc(this.getModel().get('start_date')),
      endDate: moment.utc(this.getModel().get('end_date'))
    });
  },

  handleAlertDismiss() {
    this.setState({ alertVisible: 'hidden' });
  },

  render: function() {
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
                defaultValue={this.state.term.name}
              />
            </FormGroup>
            <FormGroup controlId="start-date">
              <ControlLabel>Start Date</ControlLabel>
              <DatePicker
                id="start-date"
                dateFormat="ddd, MMM D, YYYY"
                selected={this.state.startDate}
                className="form-control"
                onChange={this.handleStartDateChange}
              />
            </FormGroup>
            <FormGroup controlId="end-date">
              <ControlLabel>End Date</ControlLabel>
              <DatePicker
                id="end-date"
                dateFormat="ddd, MMM D, YYYY"
                selected={this.state.endDate}
                className="form-control"
                onChange={this.handleEndDateChange}
              />
            </FormGroup>
            <a href="#" className="link-danger" onClick={this.delete}>Delete Term</a>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit" block onClick={this.save}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});
