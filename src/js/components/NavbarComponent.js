import * as React from 'react';
import * as _ from 'underscore';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Button, Label
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import AppsModalComponent from './AppsModalComponent';
import FeedbackModalComponent from './FeedbackModalComponent';

module.exports = React.createBackboneClass({
  links: {
    courses: ['is_instructor', 'is_admin'],
    admin: ['is_admin']
  },

  getInitialState() {
    return {
      showAppsModal: false,
      showFeedbackModal: false
    };
  },

  closeAppsModal() {
    this.setState({ showAppsModal: false });
  },

  openAppsModal(e) {
    e.preventDefault();
    this.setState({ showAppsModal: true });
  },

  closeFeedbackModal() {
    this.setState({ showFeedbackModal: false });
  },

  openFeedbackModal(e) {
    e.preventDefault();
    this.setState({ showFeedbackModal: true });
  },

  display(link) {
    var show = _.some(this.links[link], function(level) {
      return this.getModel().get(level);
    }, this);
    return show || this.getModel().get('is_client') ? 'initial' : 'none';
  },

  render () {
    let key = 'austin';
    const parser = document.createElement('a');
    parser.href = window.location.href;
    switch (parser.hostname.split('.')[parser.hostname.split('.').length - 2]) {
      case 'sanantoniocodingacademy':
        key = 'sanantonio';
        break;
      case 'dallascodingacademy':
        key = 'dallas';
        break;
      case 'houstontxcodingacademy':
        key = 'houstontx';
        break;
    }
    return(
      <div>
        <Navbar collapseOnSelect fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">
                <img src={`/img/${key}-logo.svg`} />
                Campus Manager
              </a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <li role="presentation">
                <a href='#' onClick={this.openAppsModal}>
                  <FontAwesome name="th" />
                  <div style={{
                    position: 'absolute',
                    top: '7px',
                    fontSize: '10px',
                    right: '9px'
                  }}>🔥</div>
                </a>
              </li>
              <li role="presentation"><a href='#'>Dashboard</a></li>
              <li role="presentation" style={{ display: this.display('courses') }}><a href='#courses'>Courses</a></li>
              <NavDropdown eventKey={3} title="Admin" id="admin-dropdown" style={{ display: this.display('admin') }}>
                <MenuItem eventKey={3.1} href="#users">Users</MenuItem>
                <MenuItem eventKey={3.2} href="#terms">Terms</MenuItem>
                <MenuItem eventKey={3.3} href="#tracks">Tracks</MenuItem>
                <MenuItem eventKey={3.4} href="#locations">Locations</MenuItem>
                <MenuItem eventKey={3.5} href="#textbooks">Textbooks</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.6} href="#registrations">Registrations</MenuItem>
                {
                process.env.REPORTING ?
                <MenuItem eventKey={3.7} href="#report">Reports</MenuItem>
                :
                ''
                }
              </NavDropdown>
              <NavDropdown eventKey={4} title={`${this.getModel().get('first_name')} ${this.getModel().get('last_name')}`} id="user-dropdown">
                <MenuItem eventKey={4.1} href="logout">Logout</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Button className="btn-feedback" bsStyle="warning" onClick={this.openFeedbackModal}>
          <FontAwesome name="comments-o" />
        </Button>
        <AppsModalComponent
          show={this.state.showAppsModal}
          onHide={this.closeAppsModal}
        />
        <FeedbackModalComponent
          show={this.state.showFeedbackModal}
          onHide={this.closeFeedbackModal}
        />
      </div>
    )
  }
});
