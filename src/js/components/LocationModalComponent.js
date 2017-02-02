import * as React from 'react';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
import ReactPhoneInput from 'react-phone-input';
const LocationModel = require('../models/LocationModel');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      location: this.getModel().attributes,
      alertVisible: 'hidden',
      error: '',
      title: this.props.title
    }
  },

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    this.state.location[attr] = e.currentTarget.value;
  },

  changePhone(phone) {
    this.state.location.phone = phone;
  },

  save(e) {
    e.preventDefault();
    this.getModel().save(this.state.location, {
      success: () => {
        this.props.locations.add(this.getModel(), {
          merge: true
        });
        this.props.listComponent.setState({
          location: new LocationModel()
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
    if (confirm('Are you sure you want to delete this location?')) {
      this.getModel().destroy({
        success: () => {
          this.props.locations.remove(this.getModel());
          this.props.listComponent.setState({
            location: new LocationModel()
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
      location: this.getModel().attributes
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
                defaultValue={this.state.location.name}
              />
            </FormGroup>
            <FormGroup controlId="address">
              <ControlLabel>Address</ControlLabel>
              <FormControl
                type="text"
                placeholder="Address"
                onChange={this.changeTextValue}
                defaultValue={this.state.location.address}
              />
            </FormGroup>
            <FormGroup controlId="city">
              <ControlLabel>City</ControlLabel>
              <FormControl
                type="text"
                placeholder="City"
                onChange={this.changeTextValue}
                defaultValue={this.state.location.city}
              />
            </FormGroup>
            <FormGroup controlId="state">
              <ControlLabel>State</ControlLabel>
              <FormControl
                type="text"
                placeholder="State"
                onChange={this.changeTextValue}
                defaultValue={this.state.location.state}
              />
            </FormGroup>
            <FormGroup controlId="zipcode">
              <ControlLabel>Zipcode</ControlLabel>
              <FormControl
                type="text"
                placeholder="Zipcode"
                onChange={this.changeTextValue}
                defaultValue={this.state.location.zipcode}
              />
            </FormGroup>
            <FormGroup controlId="phone">
              <ControlLabel>Phone</ControlLabel>
              <ReactPhoneInput
                defaultCountry={'us'}
                onlyCountries={['us']}
                onChange={this.changePhone}
                value={this.state.location.phone}
              />
            </FormGroup>
            <FormGroup controlId="contact">
              <ControlLabel>Contact</ControlLabel>
              <FormControl
                type="text"
                placeholder="Contact"
                onChange={this.changeTextValue}
                defaultValue={this.state.location.contact}
              />
            </FormGroup>
            <FormGroup controlId="note">
              <ControlLabel>Note</ControlLabel>
              <FormControl
                type="text"
                placeholder="Note"
                onChange={this.changeTextValue}
                defaultValue={this.state.location.note}
              />
            </FormGroup>
            <a href="#" className="link-danger" onClick={this.delete}>Delete Location</a>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit" block onClick={this.save}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});
