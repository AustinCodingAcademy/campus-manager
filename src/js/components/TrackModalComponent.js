import * as React from 'react';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
import ReactPhoneInput from 'react-phone-input';
const TrackModel = require('../models/TrackModel');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      track: this.getModel().attributes,
      alertVisible: 'hidden',
      error: '',
      title: this.props.title
    }
  },

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    this.state.track[attr] = e.currentTarget.value;
  },

  changePhone(phone) {
    this.state.track.phone = phone;
  },

  save(e) {
    e.preventDefault();
    this.getModel().save(this.state.track, {
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
                defaultValue={this.state.track.name}
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
