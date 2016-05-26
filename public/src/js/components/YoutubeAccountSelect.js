var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <div className="row">
          <div style={{textAlign: 'center'}} className="col s6 offset-s3">
            <button
              className="waves-effect waves-teal btn"
              onClick={this.selectAccount}>
              Select Youtube Account
            </button>
          </div>
        </div>
        <div className="row" style={{marginBottom: 0}}>
          <div style={{textAlign: 'center', fontSize: '12px'}} className="col s8 offset-s2">
            (You will need to select the ACA Class Screencast Account)
          </div>
        </div>
      </div>
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
