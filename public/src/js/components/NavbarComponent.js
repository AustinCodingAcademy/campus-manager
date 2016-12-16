var React = require('react');
var _ = require('underscore');
require('react.backbone');
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

module.exports = React.createBackboneClass({
  links: {
    courses: ['is_instructor', 'is_admin'],
    admin: ['is_admin']
  },

  display (link) {
    var show = _.some(this.links[link], function(level) {
      return this.getModel().get(level);
    }, this);
    return show || this.getModel().get('is_client') ? 'initial' : 'none';
  },

  render () {
    return(
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Campus Manager</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <li role="presentation"><a href='#'>Dashboard</a></li>
            <li role="presentation" style={{ display: this.display('courses') }}><a href='#courses'>Courses</a></li>
            <NavDropdown eventKey={3} title="Admin" id="admin-dropdown" style={{ display: this.display('admin') }}>
              <MenuItem eventKey={3.1} href="#users">Users</MenuItem>
              <MenuItem eventKey={3.2} href="#terms">Terms</MenuItem>
              <MenuItem eventKey={3.3} href="#locations">Locations</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.4} href="#registration">Registration</MenuItem>
              <MenuItem eventKey={3.5} href="#attendance">Attendance</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.6} href="#report">Report</MenuItem>
            </NavDropdown>
            <NavDropdown eventKey={4} title={`${this.getModel().get('first_name')} ${this.getModel().get('last_name')}`} id="user-dropdown">
              <MenuItem eventKey={4.1} href="logout">Logout</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
});
