var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <button onClick={this.selectAccount}>Select Youtube Account</button>
    );
  },

  selectAccount: function() {
    gapi.client.setApiKey(this.props.apiKey);
    this.checkAuth();
  },

  checkAuth: function() {
    gapi.auth.authorize({
      client_id: this.props.clientId,
      scope: this.props.scopes,
      immediate: false
    }, this.handleAuthResult);
  },

  handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      this.checkAccount(authResult.access_token);
    } else {
      // Handle error
      console.log('ERROR');
    }
  },

  checkAccount: function(accessToken) {
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
