import * as React from 'react';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
import TextbookModel from '../models/TextbookModel';
import TextbooksCollection from '../collections/TextbooksCollection';

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      textbook: this.getModel().attributes,
      alertVisible: 'hidden',
      error: '',
      title: this.props.title,
      deleteBtn: this.props.deleteBtn
    }
  },

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    this.state.textbook[attr] = e.currentTarget.value;
  },

  save(e) {
    e.preventDefault();
    this.getModel().save(this.state.textbook, {
      success: () => {
        this.props.textbooks.add(this.getModel(), {
          merge: true
        });
        this.props.listComponent.setState({
          textbook: new TextbookModel()
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
    if (confirm('Are you sure you want to delete this textbook?')) {
      this.getModel().destroy({
        success: () => {
          this.props.textbooks.remove(this.getModel());
          this.props.listComponent.setState({
            textbook: new TextbookModel()
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
      textbook: this.getModel().attributes,
      deleteBtn: nextProps.deleteBtn
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
                defaultValue={this.state.textbook.name}
              />
            </FormGroup>
            <FormGroup controlId="instructor_url">
              <ControlLabel>Instructor URL</ControlLabel>
              <FormControl
                type="text"
                placeholder="Instructor URL"
                onChange={this.changeTextValue}
                defaultValue={this.state.textbook.instructor_url}
              />
            </FormGroup>
            <FormGroup controlId="student_url">
              <ControlLabel>Student URL</ControlLabel>
              <FormControl
                type="text"
                placeholder="Student URL"
                onChange={this.changeTextValue}
                defaultValue={this.state.textbook.student_url}
              />
            </FormGroup>
            {this.state.deleteBtn && <a href="#" className="link-danger" onClick={this.delete}>Delete Textbook</a>}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit" block onClick={this.save}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});
