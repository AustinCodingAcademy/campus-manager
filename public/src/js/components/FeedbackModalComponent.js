import * as React from 'react';
import { Modal } from 'react-bootstrap';

module.exports = React.createBackboneClass({
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="h-iframe">
            <img className="ratio" src="http://placehold.it/8x6/ffffff/ffffff" />
              <iframe src="/feedback" frameborder="0">
            </iframe>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
});
