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
        <div className='row'>
          <div className="col s12">
            {this.state.canUploadVideo ? this.renderUploader() : this.renderAccountSelect()}
          </div>
        </div>
      </div>
    );
  },

  renderErrorMessage: function() {
    return (
      <div className="row">
        <div className="col s12">
          <div className="card-panel red darken-4 grey-text text-lighten-5">
            Oh no! It looks like you didn't select the ACA Class Videos account, go ahead and try again!
          </div>
        </div>
      </div>
    );
  },

  renderUploader: function() {
    return (
      <YoutubeUploader
        onComplete={this.onComplete}
        token={this.state.accessToken} />
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
  },

  onComplete: function(uploadResponse) {
    console.log('onComplete');
  }
});
