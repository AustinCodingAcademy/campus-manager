var React = require('react');
var YoutubeAccountSelect = require('./YoutubeAccountSelect');
var YoutubeUploader = require('./YoutubeUploader');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      showErrorMessage: false,
      canUploadVideo: false,
      accessToken: null
    };
  },

  render: function() {
    return (
      <div>
        {this.state.showErrorMessage ? this.renderErrorMessage() : ''}
        {this.state.canUploadVideo ? this.renderUploader() : this.renderAccountSelect()}
      </div>
    );
  },

  renderErrorMessage: function() {
    return (
      <div>Oh no!  You selected the wrong account ding dong!</div>
    );
  },

  renderUploader: function() {
    return (
      <YoutubeUploader token={this.state.accessToken} />
    );
  },

  renderAccountSelect: function() {
    return (
      <YoutubeAccountSelect
        apiKey={'AIzaSyD8nGoE2NLcDSBnIgTFvd_qrO1pULoxEy0'}
        clientId={'355169120001-23rnelkdfqjl43q0sllkffdth15eltgb.apps.googleusercontent.com'}
        onAccountSelect={this.checkAccount}
        scopes={['https://www.googleapis.com/auth/youtube']}/>
    );
  },

  checkAccount: function(accessToken, response) {
    if (response.result.items[0].id === 'UCzNpMM1lxoyj8paRCZoq5mA') {
      this.setState({
        canUploadVideo: true,
        showErrorMessage: false,
        accessToken: accessToken
      });
    } else {
      this.setState({showErrorMessage: true});
    }
  }
});
