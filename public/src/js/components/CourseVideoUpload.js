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
        course={this.props.model}/>
    );
  },

  renderAccountSelect: function() {
    return (
      <YoutubeAccountSelect
        onAccountSelect={this.checkAccount}
        onError={this.showErrorMessage} />
    );
  },

  checkAccount: function(accessToken, response) {
    if (response.result.items[0].id === process.env.YOUTUBE_CHANNEL_ID) {
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

    // How should we handle an error here? At this point the video is on youtube.
    // However if this save fails, we've lost that reference between the course and video
    // could attempt to retry the save possibly, might end up being a
    // manual process to find the video and create the link
    this.props.model.save();
  },

  hideErrorMessage: function() {
    this.setState({'errorMessage': false});
  },

  showErrorMessage: function(message) {
    this.setState({errorMessage: message});
  }
});
