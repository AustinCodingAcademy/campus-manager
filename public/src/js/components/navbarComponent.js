var Backbone = require('backbone');
var React = require('react');
require('backbone-react-component');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  render: function() {
    return (
      <div className="nav-wrapper">
        <a href="/" className="brand-logo">Austin Coding Academy</a>
        <a href="#" data-activates="mobile-demo" className="button-collapse">
          <i className="material-icons">menu</i>
        </a>
        <ul className="right hide-on-med-and-down">
          <li><a href="#users">Users</a></li>
          <li><a href="#sessions">Sessions</a></li>
          <li><a href="#courses">Courses</a></li>
          <li>
            <a className="dropdown-button" href="#!" data-activates="nav-user">
              {this.state.model.username} <i className="material-icons right">arrow_drop_down</i>
            </a>
          </li>
        </ul>
        <ul className="side-nav" id="mobile-demo">
          <li><a href="#users">Users</a></li>
          <li><a href="#sessions">Sessions</a></li>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#profile">Profile</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
        <ul id="nav-user" className="dropdown-content">
          <li><a href="#profile">Profile</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
    );
  },
  
  componentDidMount: function() {
    $(".button-collapse").sideNav();
    $(".dropdown-button").dropdown();
  }
});
