import * as React from 'react';
import { uniq } from 'underscore';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
const Select = require('react-select');
import ReactPhoneInput from 'react-phone-input';
const UserModel = require('../models/UserModel');
const LocationsCollection = require('../collections/LocationsCollection');

module.exports = React.createBackboneClass({
  roleOptions: [
    { value: 'admin', label: 'admin', attr: 'is_admin' },
    { value: 'instructor', label: 'instructor', attr: 'is_instructor' },
    { value: 'student', label: 'student', attr: 'is_student' }
  ],

  getInitialState() {
    const locations = new LocationsCollection();
    if (this.props.currentUser.roles().includes('admin') || this.props.currentUser.roles().includes('instructor')) {
      locations.fetch({
        success: () => {
          this.setState({
            campuses: uniq(locations.pluck('city'))
          });
        }
      });
    }
    return {
      user: this.getModel().attributes,
      roles: [],
      alertVisible: 'hidden',
      error: '',
      title: this.props.title,
      campuses: []
    }
  },

  selectRoles(options) {
    this.setState({ roles: options });
    this.roleOptions.forEach(role => {
      this.state.user[role.attr] = options.some(option => {
        return option.value === role.value;
      });
    });
  },

  changeTextValue(e) {
    const attr = e.currentTarget.getAttribute('id');
    this.state.user[attr] = e.currentTarget.value;
  },

  changePhone(phone) {
    this.state.user.phone = phone;
  },

  save(e) {
    e.preventDefault();
    this.getModel().save(this.state.user, {
      success: () => {
        if (this.props.users && this.props.listComponent) {
          this.props.users.add(this.getModel(), {
            merge: true
          });
          this.props.listComponent.setState({
            user: new UserModel()
          });
        }
        this.props.onHide();
        this.getModel().fetch();
      },
      error: (model, res) => {
        this.setState({
          error: res.responseJSON.message,
          alertVisible: ''
        });
      }
    });
  },

  delete(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this user?')) {
      this.getModel().destroy({
        success: () => {
          this.props.users.remove(this.getModel());
          this.props.listComponent.setState({
            user: new UserModel()
          });
          this.props.onHide();
        },
        error: (model, res) => {
          this.setState({
            error: res.responseJSON.message,
            alertVisible: ''
          });
        }
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.title,
      user: this.getModel().attributes,
      roles: this.roleOptions.filter(role => {
        return this.getModel().roles().includes(role.value);
      })
    });
  },

  handleAlertDismiss() {
    this.setState({ alertVisible: 'hidden' });
  },

  render() {
    const hidden = this.props.currentUser.roles().includes('admin') ? '' : 'hidden';

    const campuses = this.state.campuses.map(campus => {
      let _key = this.state.campuses.indexOf(campus)
      return (<option key={_key} value={campus}>{campus} Coding Academy</option>)
    });

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.save}>
          <Modal.Body>
            <Alert className={this.state.alertVisible} bsStyle="danger" onDismiss={this.handleAlertDismiss}>
              <p>{this.state.error}</p>
            </Alert>
            <FormGroup controlId="first_name">
              <ControlLabel>First Name</ControlLabel>
              <FormControl
                type="text"
                placeholder="First Name"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.first_name}
              />
            </FormGroup>
            <FormGroup controlId="last_name">
              <ControlLabel>Last Name</ControlLabel>
              <FormControl
                type="text"
                placeholder="Last Name"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.last_name}
              />
            </FormGroup>
            <FormGroup controlId="username">
              <ControlLabel>Email</ControlLabel>
              <FormControl
                type="email"
                placeholder="Email"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.username}
              />
            </FormGroup>
            <FormGroup controlId="phone">
              <ControlLabel>Phone</ControlLabel>
              <ReactPhoneInput
                defaultCountry={'us'}
                onlyCountries={['us']}
                onChange={this.changePhone}
                value={this.state.user.phone}
              />
            </FormGroup>
            <FormGroup controlId="roles" className={`${hidden}`}>
              <ControlLabel>Roles</ControlLabel>
              <Select
                name="roles"
                value={this.state.roles}
                options={this.roleOptions}
                onChange={this.selectRoles}
                multi={true}
              />
            </FormGroup>
            <FormGroup controlId="github">
              <ControlLabel>Github Username</ControlLabel>
              <FormControl
                type="text"
                placeholder="Github Username"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.github}
              />
            </FormGroup>
            <FormGroup controlId="rocketchat">
              <ControlLabel>Rocket.Chat Username</ControlLabel>
              <FormControl
                type="text"
                placeholder="Rocket.Chat Username"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.rocketchat}
              />
            </FormGroup>
            <FormGroup controlId="linkedIn">
              <ControlLabel>
                LinkedIn <small>(linkedin.com/in/<em>username</em>)</small>
              </ControlLabel>
              <FormControl
                type="text"
                placeholder="username"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.linkedIn}
              />
            </FormGroup>
            <FormGroup controlId="website">
              <ControlLabel>Website</ControlLabel>
              <FormControl
                type="text"
                placeholder="http://example.com"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.website}
              />
            </FormGroup>
            <FormGroup controlId="campus" className={`${hidden}`}>
              <ControlLabel>Campus</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder=""
                onChange={this.changeTextValue}
                defaultValue={this.state.user.campus}
              >
                <option value="">Select a campus...</option>
                {campuses}
              </FormControl>
            </FormGroup>
            <FormGroup controlId="zipcode">
              <ControlLabel>Zipcode</ControlLabel>
              <FormControl
                type="number"
                placeholder="Zipcode"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.zipcode}
              />
            </FormGroup>
            <FormGroup controlId="insightly" className={`${hidden}`}>
              <ControlLabel>Insightly ID</ControlLabel>
              <FormControl
                type="text"
                placeholder="12345678"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.insightly}
              />
            </FormGroup>
            <FormGroup controlId="price" className={`${hidden}`}>
              <ControlLabel>Price</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="0.00"
                  onChange={this.changeTextValue}
                  defaultValue={Number(this.state.user.price).toFixed(2)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup controlId="credits"  className={`${hidden}`}>
              <ControlLabel>Credits</ControlLabel>
              <FormControl
                type="text"
                placeholder="description:100.00, some scholarship:30.00"
                onChange={this.changeTextValue}
                defaultValue={this.state.user.credits}
              />
            </FormGroup>
            <a href="#" className={`link-danger ${hidden}`} onClick={this.delete}>Delete User</a>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit" block onClick={this.save}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});
