import * as React from 'react';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
import YoutubeAccountSelect from './YoutubeAccountSelect';
import YoutubeUploader from './YoutubeUploader';

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      errorMessage: false,
      canUploadVideo: false,
      accessToken: null
    };
  },

  render() {
    return (
      <div>
        {this.state.errorMessage ? this.renderErrorMessage() : ''}
        <Row>
          <Col xs={12}>
            {this.state.canUploadVideo ? this.renderUploader() : this.renderAccountSelect()}
          </Col>
        </Row>
      </div>
    );
  },

  renderErrorMessage() {
    return (
      <Row>
        <Col xs={12}>
          <div className="card-panel red darken-4 grey-text text-lighten-5">
            {this.state.errorMessage}
          </div>
        </Col>
      </Row>
    );
  },

  renderUploader() {
    return (
      <YoutubeUploader
        onUpload={this.hideErrorMessage}
        onError={this.showErrorMessage}
        onComplete={this.onComplete}
        token={this.state.accessToken}
        course={this.getModel()}/>
    );
  },

  renderAccountSelect() {
    return (
      <YoutubeAccountSelect
        onAccountSelect={this.checkAccount}
        onError={this.showErrorMessage} />
    );
  },

  checkAccount(accessToken, response) {
    if (response.result.items[0].id === process.env.YOUTUBE_CHANNEL_ID) {
      this.setState({
        canUploadVideo: true,
        errorMessage: false,
        accessToken: accessToken
      });
    } else {
      this.setState({
        errorMessage: "Oh no! It looks like you didn't select the ACA Class Screencasts account, please try again!"
      });
    }
  },

  onComplete(uploadResponse) {
    const videos = this.getModel().get('videos');
    videos.push({
      youtubeId: uploadResponse.id,
      link: 'https://www.youtube.com/watch?v=' + uploadResponse.id,
      timestamp: uploadResponse.snippet.title
    });

    // How should we handle an error here? At this point the video is on youtube.
    // However if this save fails, we've lost that reference between the course and video
    // could attempt to retry the save possibly, might end up being a
    // manual process to find the video and create the link
    this.getModel().save();
  },

  hideErrorMessage() {
    this.setState({'errorMessage': false});
  },

  showErrorMessage(message) {
    this.setState({errorMessage: message});
  }
});
