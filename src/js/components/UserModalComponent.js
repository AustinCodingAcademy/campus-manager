import * as React from 'react';
import { uniq } from 'underscore';
import {
  Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Checkbox,
  InputGroup, Alert
} from 'react-bootstrap';
import Select from 'react-select';
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
      campuses: [],
      credits: this.getModel().get('credits')
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

  changeCreditsValue(e) {
    this.setState({
      credits: e.target.value.split('\n').filter(credit => {
        const splitCredit = credit.split(':').map(x => x.trim());
        return splitCredit.length === 2 && splitCredit[0] && splitCredit[1] && !isNaN(splitCredit[1]);
      }).map(credit => {
        const splitCredit = credit.split(':').map(x => x.trim());
        return { name: splitCredit[0], amount: Number(splitCredit[1]) };
      })
    });
  },

  changePhone(phone) {
    this.state.user.phone = phone;
  },

  save(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state.user);
    user.credits = this.state.credits;
    this.getModel().save(user, {
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

    const credits = this.state.credits.map(credit => {
      return `${credit.name}: ${Number(credit.amount).toFixed(2)}`;
    }).join('\n');

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
              <ControlLabel>Credits<small> One credit per line. <em>Add initials and date</em> eg: <br /><em>KC Materials Fee 5/15/17: -100.00<br />DC 10% Scholarship 6/15/17: 249.00</em></small></ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder={`KC Materials Fee 5/15/17: -100.00
DC 10% Scholarship 6/15/17: 249.00`}
                onChange={this.changeCreditsValue}
                defaultValue={credits}
                rows={4}
              />
            </FormGroup>
            <FormGroup controlId="note" className={`${hidden}`}>
              <ControlLabel>Note</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Add a note..."
                onChange={this.changeTextValue}
                defaultValue={this.state.user.note}
                rows={4}
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
