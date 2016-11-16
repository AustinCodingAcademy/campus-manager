var React = require('react');
require('react.backbone');
var _ = require('underscore');
var Select = require('react-select');
var CourseOptionComponent = require('./CourseOptionComponent');
var CourseValueComponent = require('./CourseValueComponent');

module.exports = React.createBackboneClass({
  setValue (value) {
    this.getModel().set('value', value);
  },

  _courseRegister (e) {
    var that = this;
    var course = this.getModel().get('value').course;
    course.get('registrations').add(this.props.user);
    var urlRoot = course.urlRoot;
    course.urlRoot += '/register';
    course.save(null, {
      success: function() {
        course.urlRoot = urlRoot;
        that.props.user.fetch();
      }
    });
  },

  render: function() {
    var alreadyRegistered = this.getCollection().some(function(term) {
      return _.intersection(this.props.user.get('courses').pluck('_id'), term.get('courses').pluck('_id')).length > 0;
    }, this);

    var registrationCard;

    if (this.getModel().get('totalPaid') - this.getModel().get('totalCourseCost') < 0) {
      registrationCard = (
        <div className="card-panel red">
          <span className="white-text">
            You have a negative balance!
          </span>
        </div>
      );
    } else if (alreadyRegistered) {
      registrationCard = (
        <div className="card-panel green">
          <span className="white-text">
            You are all registered and ready to go! See the course textbook, details, and dates below.
          </span>
        </div>
      );
    } else {
      if (this.getCollection().length) {
        if (this.getModel().get('totalPaid') - this.getModel().get('totalCourseCost') < 490) {
          registrationCard = (
            <div className="card-panel deep-orange darken-4">
              <span className="white-text">
                Registration for the next session is open! To register for another course, you must pay a deposit of at least <strong>$490.00</strong>.
              </span>
            </div>
          );
        } else {
          var options = [];

          this.getCollection().each(term => {
            term.get('courses').each(course => {
              var label = course.get('name') +
              course.get('location').get('name') +
              course.get('location').get('address') +
              course.get('location').get('city') +
              course.get('location').get('state') +
              course.get('location').get('zipcode');
              options.push({
                value: course.id,
                label: label,
                course: course,
                term: term,
                disabled: course.full()
              });
            });
          });

          var disabled = this.getModel().get('value') ? '' : 'disabled';

          registrationCard = (
            <div>
              <Select
                name="courses"
                options={options}
                optionComponent={CourseOptionComponent}
                placeholder="Select a course"
                valueComponent={CourseValueComponent}
                value={this.getModel().get('value')}
                onChange={this.setValue}
              />
              <br />
              <button className={'btn btn-primary '+disabled} disabled={disabled} onClick={this._courseRegister}>Register
                <i className="material-icons right">send</i>
              </button>
            </div>
          );
        }
      } else {
        registrationCard = (
          <div className="card-panel teal">
            <span className="white-text">Stay tuned for upcoming courses!</span>
          </div>
        );
      }
    }

    return (
      <div className="card">
        <div className="card-content">
          <span className="card-title">Registration</span>
          {registrationCard}
        </div>
      </div>
    );
  }
});
