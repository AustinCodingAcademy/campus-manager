var React = require('react');
var _ = require('underscore');
require('react.backbone');

module.exports = React.createBackboneClass({
  links: {
    'courses': ['is_instructor', 'is_admin'],
    'attendance': ['is_admin'],
    'terms': ['is_admin'],
    'registration': ['is_admin'],
    'report': ['is_admin'],
    'users': ['is_admin'],
    'locations': ['is_admin'],
    'admin': ['is_admin']
  },

  hidden: function(link) {
    var show = _.some(this.links[link], function(level) {
      return this.getModel().get(level);
    }, this);
    if (show || this.getModel().get('is_client')) {
      return '';
    } else {
      return 'hidden';
    }
  },

  render: function() {
    return (
      <div>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper white">
              <a href="#" className="brand-logo">
                <img alt="ACA Logo" src="/img/aca-logo-header.jpg" style={{width:195}}/>
              </a>
              <a href="#" data-activates="mobile-demo" className="button-collapse">
                <i className="material-icons black-text">menu</i>
              </a>
              <ul className="right hide-on-med-and-down">
                <li><a href="#apps" className="black-text"><i className="material-icons">apps</i></a></li>
                <li><a href="#" className="black-text">Dashboard</a></li>
                <li className={this.hidden('courses')}><a href="#courses" className="black-text">Courses</a></li>
                <li>
                  <a className={this.hidden('admin') + " dropdown-button black-text"} data-activates="nav-admin">
                    Admin <i className="material-icons right">arrow_drop_down</i>
                  </a>
                </li>
                <li>
                  <a className="dropdown-button black-text" href="#!" data-activates="nav-user">
                    {this.getModel().get('username')} <i className="material-icons right">arrow_drop_down</i>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <ul className="side-nav" id="mobile-demo">
          <li><a href="#apps" className="modal-trigger"><i className="material-icons black-text">apps</i></a></li>
          <li><a href="#">Dashboard</a></li>
          <li className={this.hidden('users')}><a href="#users">Users</a></li>
          <li className={this.hidden('courses')}><a href="#courses">Courses</a></li>
          <li className={this.hidden('terms')}><a href="#terms">Terms</a></li>
          <li className={this.hidden('locations')}><a href="#locations">Locations</a></li>
          <li className={this.hidden('attendance')}><a href="#attendance">Attendance</a></li>
          <li className={this.hidden('registration')}><a href="#registration">Registration</a></li>
          <li className={this.hidden('report')}><a href="#report">Report</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
        <ul id="nav-user" className="dropdown-content">
          <li><a className="teal-text text-darken-4" href="/logout">Logout</a></li>
        </ul>
        <ul id="nav-admin" className="dropdown-content">
          <li className={this.hidden('users')}><a href="#users" className="black-text">Users</a></li>
          <li className={this.hidden('terms')}><a href="#terms" className="black-text">Terms</a></li>
          <li className={this.hidden('locations')}><a href="#locations" className="black-text">Locations</a></li>
          <li className={this.hidden('attendance')}><a href="#attendance" className="black-text">Attendance</a></li>
          <li className={this.hidden('registration')}><a href="#registration" className="black-text">Registration</a></li>
          <li className={this.hidden('report')}><a href="#report" className="black-text">Report</a></li>
        </ul>
      </div>
    );
  },

  componentDidMount: function() {
    $(".button-collapse").sideNav({ closeOnClick: true });
    $(".dropdown-button").dropdown();
  }
});
