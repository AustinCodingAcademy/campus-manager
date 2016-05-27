var React = require('react');
var YoutubeAccountSelect = require('./YoutubeAccountSelect');
var YoutubeUploader = require('./YoutubeUploader');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      errorMessage: false,
      canUploadVideo: false,
      accessToken: null
    };
  },

  render: function() {
    console.log(process.env);
    return (
      <div>
        {this.state.errorMessage ? this.renderErrorMessage() : ''}
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
            {this.state.errorMessage}
          </div>
        </div>
      </div>
    );
  },

  renderUploader: function() {
    return (
      <YoutubeUploader
        onUpload={this.hideErrorMessage}
        onError={this.showErrorMessage}
        onComplete={this.onComplete}
        token={this.state.accessToken}
        snippetDescription={
          'Course Name: ' + this.props.model.get('name') + '\n Term: ' + this.props.model.get('term').get('name')
        }/>
    );
  },

  renderAccountSelect: function() {
    return (
      <YoutubeAccountSelect
        apiKey={'AIzaSyD8nGoE2NLcDSBnIgTFvd_qrO1pULoxEy0'}
        clientId={'355169120001-23rnelkdfqjl43q0sllkffdth15eltgb.apps.googleusercontent.com'}
        onAccountSelect={this.checkAccount}
        onError={this.showErrorMessage}
        scopes={['https://www.googleapis.com/auth/youtube']}/>
    );
  },

  checkAccount: function(accessToken, response) {
    if (response.result.items[0].id === 'UCzNpMM1lxoyj8paRCZoq5mA') {
      this.setState({
        canUploadVideo: true,
        errorMessage: false,
        accessToken: accessToken
      });
    } else {
      this.setState({
        errorMessage: "Oh no! It looks like you didn't select the ACA Class Videos account, please try again!"
      });
    }
  },

  onComplete: function(uploadResponse) {
    var videos = this.props.model.get('videos');
    videos.push({
      youtubeId: uploadResponse.id,
      link: 'https://www.youtube.com/watch?v=' + uploadResponse.id,
      timestamp: uploadResponse.snippet.title
    });
    this.props.model.save();
  },

  hideErrorMessage: function() {
    this.setState({'errorMessage': false});
  },

  showErrorMessage: function(message) {
    this.setState({errorMessage: message});
  }
});
