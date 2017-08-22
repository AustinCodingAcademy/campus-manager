import * as React from 'react';
import * as Backbone from 'backbone';
import {
  Alert, Button, Row, Col, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      user: this.getModel().attributes,
      message: '',
      alertVisible: 'hidden',
      alertType: ''
    }
  },

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    this.state.user[attr] = e.currentTarget.value;
  },

  save(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state.user);
    this.getModel().save(user, {
      success: () => {
        this.setState({
          message: 'Settings Saved!',
          alertVisible: '',
          alertType: 'success'
        });
      },
      error: (model, res) => {
        this.setState({
          message: res.responseJSON.message,
          alertVisible: '',
          alertType: 'danger'
        });
      }
    });
  },

  handleAlertDismiss() {
    this.setState({ alertVisible: 'hidden' });
  },

  render() {
    return (
      <Row>
        <Col xs={12} md={6} mdOffset={3}>
        <Alert className={this.state.alertVisible} bsStyle={this.state.alertType} onDismiss={this.handleAlertDismiss}>
            <p>{this.state.message}</p>
          </Alert>
          <form onSubmit={this.save}>
            <FormGroup controlId="stripe_secret_key">
              <ControlLabel>Stripe Secret Key</ControlLabel>
              <FormControl
                type="text"
                placeholder="Stripe Secret Key"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.stripe_secret_key}
              />
            </FormGroup>
            <FormGroup controlId="stripe_publishable_key">
              <ControlLabel>Stripe Publishable Key</ControlLabel>
              <FormControl
                type="text"
                placeholder="Stripe Publishable Key"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.stripe_publishable_key}
              />
            </FormGroup>
            <Button bsStyle="primary" type="submit" onClick={this.save}>Save</Button>
          </form>
        </Col>
      </Row>
    );
  }
});
