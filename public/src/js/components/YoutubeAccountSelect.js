var React = require('react');

module.exports = React.createBackboneClass({
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
    // Since we are pulling this library in over cdn,
    // we need to ensure it is here...
    if (typeof gapi === 'undefined') {
      this.props.onError(
        'We are unable to upload videos at this time.  Please try agian later.'
      );
      return;
    }
    gapi.client.setApiKey(process.env.GOOGLE_API_KEY);
    this.checkAuth();
  },

  checkAuth: function() {
    gapi.auth.authorize({
      client_id: process.env.GOOGLE_CLIENT_ID,
      scope: ['https://www.googleapis.com/auth/youtube'],
      immediate: false
    }, this.handleAuthResult);
  },

  handleAuthResult: function(authResult) {
    if (authResult && !authResult.error) {
      this.checkAccount(authResult.access_token);
    } else {
      this.props.onError(
        'There was an error accessing your account. Please try again.'
      );
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
