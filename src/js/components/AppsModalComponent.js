import * as React from 'react';
import {
  Modal, Row, Col, Label
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

module.exports = React.createBackboneClass({
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Apps</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={4} className="text-center">
              <a className="btn btn-white" href={process.env.ROCKETCHAT_URL} target="blank">
                <FontAwesome name="rocket" fixedWidth={true} size="3x" />
                <br />
                &nbsp;Chat
              </a>
            </Col>
            <Col xs={4} className="text-center">
              <a className="btn btn-white" href="https://calendar.austincodingacademy.com" target="blank">
                <FontAwesome name="calendar" fixedWidth={true} size="3x" />
                <br />
                &nbsp;Calendar
              </a>
            </Col>
            <Col xs={4} className="text-center">
              <a className="btn btn-white" href="https://austincodingacademy.com/tutors" target="blank">
                <FontAwesome name="graduation-cap" fixedWidth={true} size="3x" />
                <br />
                &nbsp;Tutoring
                <br/>
                <Label bsStyle="warning">New!</Label>
              </a>
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col xs={4} className="text-center">
              <a className="btn btn-white" href={process.env.DISCOURSE_URL} target="blank">
                <FontAwesome name="group" fixedWidth={true} size="3x" />
                <br />
                &nbsp;Discourse
              </a>
            </Col>
            <Col xs={4} className="text-center">
              <a className="btn btn-white" href="https://student.austincodingacademy.com" target="blank">
                <FontAwesome name="book" fixedWidth={true} size="3x" />
                <br />
                &nbsp;Handbook
              </a>
            </Col>
            <Col xs={4} className="text-center">
              <a className="btn btn-white" href="https://meet.jit.si" target="blank">
                <FontAwesome name="video-camera" fixedWidth={true} size="3x" />
                <br />
                &nbsp;Jitsi
              </a>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
});
