var Backbone = require('backbone');
var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
require('backbone-react-component');
var RegistrationItemComponent = require('./registrationItemComponent');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  componentDidMount: function() {
    $('select').material_select();
  },
  
  render: function() {
    var that = this;
    var registrations = [];
    
    this.props.collection.each(function(course) {
      course.get('registrations').each(function(user) {
        registrations.push({ course: course, user: user });
      });
    });
    
    var registrationItems = _.map(registrations, function(registration, idx) {
      return <RegistrationItemComponent key={idx} user={registration.user} course={registration.course} collection={that.props.collection}/>
    });
    
    var courseOptions = [];
    this.props.collection.each(function(course) {
      courseOptions.push(<option key={course.id} value={course.id}>{course.get('term').get('name') + ' - ' + course.get('name')}</option>);
    });
    
    var userOptions = [];
    this.props.users.each(function(user) {
      userOptions.push(<option key={user.id} value={user.id}>{user.fullName() + ' (' + user.get('username') + ')'}</option>);
    });
    
    return (
      <div className="row">
        <div className="col s12">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Term</th>
              </tr>
            </thead>
            <tbody>
              {registrationItems}
            </tbody>
          </table>
          <div className="row">
            <div className="input-field col m6 s12">
              <select defaultValue={this.props.users.first().id} ref="user">
                {userOptions}
              </select>
              <label>User</label>
            </div>
            <div className="input-field col m6 s12">
              <select defaultValue={this.props.collection.first().id} ref="course">
                {courseOptions}
              </select>
              <label>Course</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
