var Backbone = require('backbone');
var _ = require('underscore');
var React = require('react');
require('backbone-react-component');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],

  addGrade: function(e) {
    e.preventDefault();
    var gradeName = this.refs.grade.value;
    if (gradeName && this.props.model.get('grades').indexOf(gradeName) === -1) {
      this.props.model.get('grades').push(gradeName);
      this.props.model.save();
    }
    this.refs.grade.value = '';
  },

  focusGrade: function(e) {
    $(e.currentTarget).removeClass('disabled');
  },

  blurGrade: function(e) {
    $(e.currentTarget).addClass('disabled');
    if ($(e.currentTarget).val()) {
      var student = this.props.model.get('registrations').get($(e.currentTarget).data('student-id'));
      var gradeIdx = _.findIndex(student.get('grades'), function(grade) {
        return grade.courseId === this.props.model.id && grade.name === $(e.currentTarget).data('grade-name');
      }, this);
      student.get('grades')[gradeIdx].score = Number($(e.currentTarget).val());
      student.save();
    }
  },

  render: function() {
    var userRows = this.props.model.get('registrations').map(function(student, i) {
      return (
        <tr key={i}>
          <td className="text-right">
            {student.fullName()}
          </td>
        </tr>
      );
    });

    var gradeNames = _.map(this.props.model.get('grades'), function(grade, i) {
      this.props.model.get('registrations').each(function(student){
        if (_.pluck(student.get('grades'), 'name').indexOf(grade) === -1) {
          student.get('grades').push({
            courseId: this.props.model.id,
            name: grade,
            score: ''
          });
        }
      }, this);

      return (
        <td key={i}>
          {grade}
        </td>
      );
    }, this);

    var studentGrades = this.props.model.get('registrations').map(function(student, i) {
      var courseGrades = _.filter(student.get('grades'), function(grade) {
        return grade.courseId === this.props.model.id;
      }, this);

      var studentCells = _.map(courseGrades, function(grade, i) {
        return (
          <td key={i}>
            <input
            type="text"
            className="trim-margin disabled"
            style={{ height: '1rem' }}
            defaultValue={grade.score}
            onFocus={this.focusGrade}
            onBlur={this.blurGrade}
            data-student-id={student.id}
            data-grade-name={grade.name} />
          </td>
        );
      }, this);

      return (
        <tr key={i}>
          {studentCells}
        </tr>
      );
    }, this);

    var emails = this.props.model.get('registrations').map(function(student) {
      return student.get('username');
    });

    return (
      <div className="row">
        <div className="s12">
          <h3>{this.props.model.get('term').get('name') + ' - ' + this.props.model.get('name')}</h3>
          <div className="row">
            <form onSubmit={this.addGrade}>
              <div className="col s4">
                <a href={'mailto:' + this.props.currentUser.get('username') + '?bcc=' + emails} className="waves-effect waves-teal btn" target="_blank">
                  <i className="material-icons left">mail</i> Email Class
                </a>
              </div>
              <div className="col s4 input-field trim-margin">
                <input id="grade" type="text" ref="grade" className="right" />
                <label htmlFor="grade">Grade Name</label>
              </div>
              <div className="col s4">
                <button className="waves-effect waves-teal btn left"><i className="material-icons right">send</i> Submit</button>
              </div>
            </form>
          </div>
          <div className="row">
            <div className="col s3">
              <table className="striped">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {userRows}
                </tbody>
              </table>
            </div>
            <div className="col s9" style={{overflowX: 'scroll'}}>
              <table className="striped">
                <thead>
                  <tr>
                    {gradeNames}
                  </tr>
                </thead>
                <tbody>
                  {studentGrades}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
