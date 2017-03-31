import * as React from 'react';
import { Modal } from 'react-bootstrap';

module.exports = React.createBackboneClass({

  componentDidMount() {
    window.addEventListener("message", function(e) {
      if (typeof e.data === 'string' && e.data.indexOf('feedback-iframe') > -1) {
        document.getElementById('feedback-iframe').className = 'hidden';
        document.getElementById('thank-you-feedback').className = '';
      }
      if (typeof e.data === 'string' && e.data.indexOf('resized') > -1) {
        document.getElementById('ratio').setAttribute('style', 'min-height: ' + e.data.split('-')[1] + 'px');
      }
    });
  },

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="iframe-wrapper" id="feedback-iframe">
            <div className="h-iframe">
              <div className="ratio" id="ratio" />
              <iframe src="/feedback" frameBorder="0"></iframe>
            </div>
          </div>
          <div className="hidden" id="thank-you-feedback">
            <div className="alert alert-success text-center" role="alert">
              <h3 style={{marginTop:'10px'}}>Thanks for your feedback!</h3>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
});
