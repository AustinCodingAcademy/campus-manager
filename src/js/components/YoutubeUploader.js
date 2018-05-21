import * as React from 'react';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import MediaUploader from '../modules/MediaUploader';
import DatePicker from 'react-datepicker';
import { Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

module.exports = React.createBackboneClass({
  getInitialState: function() {
    return {
      uploadStatus: 'upload',
      uploadProgress: 0,
      date: null
    };
  },

  render: function() {
    return (
      <div className={this.state.uploadStatus} id={'youtube-uploader'}>
        <Row>
          <Col xs={12}>
            {this.renderDropZone()}
            <br />
            {this.renderProgressBar()}
          </Col>
        </Row>
      </div>
    );
  },

  renderDropZone: function() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="date">
              <ControlLabel>1. Select Lecture Date</ControlLabel>
              <DatePicker
                dateFormat="ddd, MMM D"
                className="form-control"
                onChange={this.handleDateChange}
                selected={this.state.date}
              />
            </FormGroup>
            {this.state.date ?
            <FormGroup controlId="date">
              <ControlLabel>2. Upload Video</ControlLabel>
              <Dropzone
                accept={'video/*'}
                multiple={false}
                onDrop={this.onDrop}
                className='dropzone-base-style'
                activeClassName='dropzone-active-style'
              >
                <div>
                  <FontAwesome name="cloud" size="3x" className={`text-primary ${this.state.uploadStatus === 'upload' ? '' : 'hidden'}`} />
                  <FontAwesome name="cloud-upload" size="3x" className={`text-primary ${this.state.uploadStatus === 'uploading' ? '' : 'hidden'}`} />
                  <FontAwesome name="cloud" size="3x" className={`text-success ${this.state.uploadStatus === 'complete' ? '' : 'hidden'}`} />
                  <FontAwesome name="cloud" size="3x" className={`text-danger ${this.state.uploadStatus === 'error' ? '' : 'hidden'}`} />
                  <div className="text">
                    <div>Drag and Drop your video here to upload to YouTube!</div>
                    <small>(or click here to select your video, if you're in to that)</small>
                  </div>
                </div>
              </Dropzone>
            </FormGroup>
            : ''}
          </Col>
        </Row>
      </div>
    );
  },

  handleDateChange: function(date) {
    this.setState({date: date});
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
        title: this.state.date.format('YYYY-MM-DD'),
        description: `${this.props.course.get('term').get('name')} - ${this.props.course.get('name')} ${this.state.date.format('ddd, MMM Do, YYYY')}`
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
