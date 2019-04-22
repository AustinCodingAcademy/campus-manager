import * as React from 'react';
import {
  Modal, Row, Col, Label, Image
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
              <a className="btn btn-white" href="https://austincodingacademy.com/schedule-tutoring/" target="blank">
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
                <Image src="/img/Hack_Overflow_Icon.png" responsive style={{width: '4.2rem', margin: 'auto'}} />
                &nbsp;Hack Overflow
              </a>
            </Col>
            <Col xs={4} className="text-center">
              <a className="btn btn-white" href="https://student.austincodingacademy.com" target="blank">
                <FontAwesome name="book" fixedWidth={true} size="3x" />
                <br />
                &nbsp;Handbook
              </a>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
});
