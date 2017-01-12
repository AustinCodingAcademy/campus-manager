import * as React from 'react';
import {Row, Col, Button, Alert} from 'react-bootstrap';

module.exports = React.createBackboneClass({
  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Button onClick={this.selectAccount} bsStyle="primary" block>
              Select YouTube Account
            </Button>
            <br />
            <Alert bsStyle="info">
              You will need to select the <strong>ACA Class Screencasts</strong> Account
            </Alert>
          </Col>
        </Row>
      </div>
    );
  },

  selectAccount() {
    // Since we are pulling this library in over cdn,
    // we need to ensure it is here...
    if (typeof gapi === 'undefined') {
      this.props.onError(
        'We are unable to upload videos at this time. Please try agian later.'
      );
      return;
    }
    gapi.client.setApiKey(process.env.GOOGLE_API_KEY);
    this.checkAuth();
  },

  checkAuth() {
    gapi.auth.authorize({
      client_id: process.env.GOOGLE_CLIENT_ID,
      scope: ['https://www.googleapis.com/auth/youtube'],
      immediate: false
    }, this.handleAuthResult);
  },

  handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      this.checkAccount(authResult.access_token);
    } else {
      this.props.onError(
        'There was an error accessing your account. Please try again.'
      );
    }
  },

  checkAccount(accessToken) {
    var onAccountSelect = this.props.onAccountSelect;

    gapi.client.load('youtube', 'v3', function() {
      var request = gapi.client.youtube.channels.list({
        mine: true,
        part: 'contentDetails,contentOwnerDetails,id,snippet'
      });

      request.then(function(response) {
        onAccountSelect(accessToken, response);
      });
    });
  }
});
