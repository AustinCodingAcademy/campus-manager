import * as React from 'react';
import { Modal } from 'react-bootstrap';

module.exports = React.createBackboneClass({

  style: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  render() {
    return (
      <Modal size="sm" style={this.style} show={this.props.show} onHide={this.props.onHide} autoFocus={true}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Congrats on starting your coding journey with us!  Check your email for your payment confirmation.
        </Modal.Body>
      </Modal>
    );
  }
});
