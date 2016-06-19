var _ = require('underscore');
var React = require('react');
require('react.backbone');
var RegistrationItemComponent = React.createFactory(require('./RegistrationItemComponent'));

module.exports = React.createBackboneClass({
  componentDidMount: function() {
    $('select').material_select();
  },

  registerUser: function(e) {
    e.preventDefault();
    var that = this;
    var course = this.props.collection.get(this.refs.course.value);
    course.get('registrations').push(this.props.users.get(this.refs.user.value));
    course.save();
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
      return RegistrationItemComponent({
        user: registration.user,
        course: registration.course,
        collection: that.props.collection
      });
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
      <div>
        <br/>
        <form className="col s12" onSubmit={this.registerUser}>
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
          <div className="row">
            <div className="input-field col s12">
              <button className="btn waves-effect waves-light" type="submit" name="action">Register
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col s12">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Term</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {registrationItems}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});
