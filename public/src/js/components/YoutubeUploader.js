var React = require('react');
var Dropzone = require('react-dropzone');
var MediaUploader = require('../modules/MediaUploader');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
      <Dropzone multiple={false} onDrop={this.onDrop}>
        <div>I am the uplaod man!</div>
      </Dropzone>
      </div>
    );
  },

  onDrop: function(files) {
    var file = files[0];

    var metadata = {
      snippet: {
        title: Date.now(),
        description: 'Video'
      },
      status: {
        privacyStatus: 'unlisted'
      }
    };

    var uploader = new MediaUploader({
      baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
      file: file,
      token: this.props.token,
      metadata: metadata,
      params: {
        part: 'snippet,status,contentDetails,player'
      },
      onError: this.onError,
      onProgress: this.onProgress,
      onComplete: this.onComplete
    });

    uploader.upload();
  },

  onError: function(data) {
    console.log('ERROR: ', data);
  },

  onProgress: function(data) {
    var bytesUploaded = data.loaded;
    var totalBytes = data.total;
    var percentageComplete = Math.floor((bytesUploaded * 100) / totalBytes);
    // this.setState({progress: percentageComplete});
    console.log('Progres: ', percentageComplete + '%');
  },

  onComplete: function(data) {
    var uploadResponse = JSON.parse(data);
    console.log('Complete: ', uploadResponse);
  }
});
