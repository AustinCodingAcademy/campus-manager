var React = require('react');
var Dropzone = require('react-dropzone');
var moment = require('moment');
var MediaUploader = require('../modules/MediaUploader');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      uploadStatus: 'upload',
      uploadProgress: 0
    };
  },

  componentDidMount: function() {
    this.pickadate = $('input[type="date"]').pickadate().pickadate('picker');
    this.pickadate.set('select', new Date().getTime(), { muted: true });
    $('input[type="time"]').pickatime();
  },

  render: function() {
    return (
      <div className={this.state.uploadStatus} id={'youtube-uploader'}>
        <div className="row">
          <div className="col s12">
            {this.renderDropZone()}
          </div>
        </div>
        <div className="row" style={{marginBottom: 0}}>
          <div className="col s12">
            {this.renderProgressBar()}
          </div>
        </div>
      </div>
    );
  },

  renderDropZone: function() {
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <Dropzone
              accept={'video/*'}
              multiple={false}
              onDrop={this.onDrop}
              className='dropzone-base-style'
              activeClassName='dropzone-active-style'>
              <div>
                <i className="material-icons center large upload">cloud_queue</i>
                <i className="material-icons center large uploading">cloud_upload</i>
                <i className="material-icons center large complete">cloud_done</i>
                <i className="material-icons center large error">error</i>
                <div className="text">
                  <div>Drag and Drop your video here to upload to youtube!</div>
                  <div style={{fontSize: '11px'}}>(or click here to select your video, if you're in to that)</div>
                </div>
              </div>
            </Dropzone>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <label htmlFor="lecture-date">Select date of lecture:</label>
            <input
              type="date"
              name="lecture-date"
              onChange={this.handleDateChange}
              ref="date"/>
          </div>
        </div>
      </div>
    );
  },

  handleDateChange: function(event) {
    this.setState({date: event.target.value});
  },

  renderProgressBar: function() {
    var indicatorStyle = {
      width: this.state.uploadStatus === 'complete' ?
        '100%' : this.state.uploadProgress + '%'
    };

    if (this.state.uploadProgress) {
      return (
        <div className='progress-bar-container'>
          <div className='progress-indicator'
            style={indicatorStyle}>
          </div>
        </div>
      );
    }

    return '';
  },

  onDrop: function(files) {
    var file = files[0];

    var metadata = {
      snippet: {
        title: moment(this.refs.date.value, 'D MMMM, YYYY').format('YYYY-MM-DD'),
        description: this.props.snippetDescription
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
        part: 'snippet,status,contentDetails'
      },
      onError: this.onError,
      onProgress: this.onProgress,
      onComplete: this.onComplete
    });

    uploader.upload();
    this.props.onUpload();
    this.setState({uploadStatus: 'uploading'});
  },

  onError: function(data) {
    data = JSON.parse(data);
    this.props.onError(data.error.message);
    this.setState({uploadStatus: 'error'});
  },

  onProgress: function(data) {
    var bytesUploaded = data.loaded;
    var totalBytes = data.total;
    var percentageComplete = Math.floor((bytesUploaded * 100) / totalBytes);

    if (!isNaN(percentageComplete) && percentageComplete > this.state.uploadProgress) {
      this.setState({uploadProgress: percentageComplete});
    }
  },

  onComplete: function(data) {
    var uploadResponse = JSON.parse(data);
    this.setState({uploadStatus: 'complete'});
    this.props.onComplete(uploadResponse);
  }
});
