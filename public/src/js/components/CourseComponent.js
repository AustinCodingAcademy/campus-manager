var _ = require('underscore');
var React = require('react');
var moment = require('moment');
var BaseModal = require('./BaseModal');
var LineChart = require('react-chartjs').Line;
var Chart = require('chart.heatmap.js');
var CourseVideoUpload = require('./CourseVideoUpload');
var Hashids = require('hashids');
require('react.backbone');

module.exports = React.createBackboneClass({
  getInitialState: function() {
    return {
      modalIsOpen: false
    };
  },

  componentDidUpdate: function() {
    Materialize.updateTextFields();
    var ctx = this.refs.heatmap.getContext('2d');
    var newChart = new Chart(ctx).HeatMap(this.getModel().studentAttendance().data, this.getModel().studentAttendance().options);
  },

  addGrade: function(e) {
    e.preventDefault();
    var gradeName = this.refs.grade.value;
    if (gradeName && this.getModel().get('grades').indexOf(gradeName) === -1) {
      this.getModel().get('grades').push(gradeName);
      this.getModel().save();
    }
    this.refs.grade.value = '';
  },

  removeGrade: function(e) {
    e.preventDefault();
    var gradeName = $(e.currentTarget).data('grade-name');
    var r = confirm('Are you sure you want to delete ' + gradeName + '?');
    if (r == true) {
      var gradeIdx = this.getModel().get('grades').indexOf(gradeName);
      this.getModel().get('grades').splice(gradeIdx, 1);
      this.getModel().get('registrations').each(function(student) {
        var gradeIdx = _.findIndex(student.get('grades'), function(grade) {
          return grade.courseId === this.getModel().id && grade.name === $(e.currentTarget).data('grade-name');
        }, this);
        student.get('grades').splice(gradeIdx, 1);
        student.save();
      }, this);
      this.getModel().save();
    }
  },

  focusGrade: function(e) {
    $(e.currentTarget).removeClass('disabled');
  },

  blurGrade: function(e) {
    e.persist();
    var that = this;
    $(e.currentTarget).addClass('disabled');
    var student = this.getModel().get('registrations').get($(e.currentTarget).data('student-id'));
    var gradeIdx = _.findIndex(student.get('grades'), function(grade) {
      return grade.courseId === this.getModel().id && grade.name === $(e.currentTarget).data('grade-name');
    }, this);
    var originalScore = student.get('grades')[gradeIdx].score;
    if ($(e.currentTarget).val() && !isNaN($(e.currentTarget).val()) && Number($(e.currentTarget).val()) > -1 ) {
      student.get('grades')[gradeIdx].score = Number($(e.currentTarget).val());
      student.save(null, {
        error: function() {
          e.target.value = originalScore;
          student.get('grades')[gradeIdx].score = originalScore;
          that.forceUpdate();
        },
        success: function() {
          that.forceUpdate();
        }
      });
    } else {
      $(e.currentTarget).val(originalScore);
    }
  },

  // I'm thinking how we show modals is in need of an update. Going into the dom
  // like this seems like an anti-pattern.  We would probably be better off
  // having some type of modal component and passing it a child component.
  // We would be less likely to run into weird bugs as a result of
  // repeating this logic over and over again
  //
  // <Modal> <CourseVideoUpload /> </Modal>
  showUploadModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  removeVideo: function(e) {
    e.preventDefault();
    var r = confirm("You sure you wanna delete this video?");
    if (r === true) {
      var idx = $(e.currentTarget).data('idx');
      this.getModel().get('videos').splice(idx, 1);
      this.getModel().save();
    }

  },

  render: function() {
    var userRows = this.getModel().get('registrations').map(function(student, i) {

      var courseGrades = _.filter(_.pluck(_.where(student.get('grades'), {courseId: this.getModel().id}), 'score'), function(score) {
        return _.isNumber(score);
      });
      var courseAverage = Math.round(_.reduce(courseGrades, function(memo, num) { return memo + num; }) / courseGrades.length) || 0;

      var courseAttendance = _.filter(student.get('attendance'), function(checkIn) {
        return _.find(this.getModel().pastDates(), function(date) {
          return moment(checkIn, 'YYYY-MM-DD HH:ss').isSame(date, 'day');
        });
      }, this);

      var courseAttendanceAverage = Math.round(courseAttendance.length / this.getModel().pastDates().length * 100);

      return (
        <tr key={i}>
          <td className="right-align nowrap" style={{height: '51px', padding: '0 5px'}}>
            <a href={'#users/' + student.id}>{student.fullName()}</a>
            <br />
            <small>Course Att: <span className={'score' + courseAttendanceAverage}>{courseAttendanceAverage}</span> Avg: <span className={'score' + courseAverage}>{courseAverage}</span></small>
          </td>
        </tr>
      );
    }, this);

    var gradeNames = _.map(this.getModel().get('grades'), function(grade, i) {
      var assignmentGrades = [];
      this.getModel().get('registrations').each(function(student){
        var match = _.findWhere(student.get('grades'), { name: grade, courseId: this.getModel().id });
        if (!match) {
          student.get('grades').push({
            courseId: this.getModel().id,
            name: grade,
            score: ''
          });
        } else {
          if (_.isNumber(match.score)){
            assignmentGrades.push(match.score);
          }
        }
      }, this);

      var assignmentAverage = Math.round(_.reduce(assignmentGrades, function(memo, num) { return memo + num; }) / assignmentGrades.length) || 0;

      return (
        <td key={i} className='nowrap'>
          {grade}
          <sup><a href="#" onClick={this.removeGrade} data-grade-name={grade}>x</a></sup>
          <br />
          <small>Avg: <span className={'score' + assignmentAverage}>{assignmentAverage}</span></small>

        </td>
      );
    }, this);

    var studentGrades = this.getModel().get('registrations').map(function(student, i) {
      var courseGrades = _.filter(student.get('grades'), function(grade) {
        return grade.courseId === this.getModel().id;
      }, this);

      var studentCells = _.map(courseGrades, function(grade, i) {
        return (
          <td key={i} style={{height: '51px', padding: '0 5px'}} >
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

    var emails = this.getModel().get('registrations').map(function(student) {
      return student.get('username');
    });

    var videos = _.map(this.getModel().get('videos'), function(video, idx) {
      return (
        <p key={idx}><a href={video.link} target="_blank">{moment(video.timestamp, 'YYYY-MM-DD').format('ddd, MMM Do, YYYY')}</a> (<a href="#" data-idx={idx} onClick={this.removeVideo}>x</a>)</p>
      );
    }, this);

    var hashids = new Hashids();
    var hash = hashids.encode(Number(moment().format('YYYY-MM-DD').split('-').join(''))).slice(0, 4).toUpperCase();

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5>{this.getModel().get('term').get('name')}</h5>
            <h3>{this.getModel().get('name')}</h3>
            <h6 className="align-right">Daily Attendance Code: <strong>{hash}</strong></h6>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m4">
            <a href={'mailto:' + this.props.currentUser.get('username') + '?bcc=' + emails} className="waves-effect waves-teal btn" target="_blank">
              <i className="material-icons left">mail</i> Email Class
            </a>
            <br /><br />
          </div>
          <div className="col s12 m4">
            <a
              onClick={this.showUploadModal}
              className="waves-effect waves-teal btn">
              <i className="fa fa-youtube-play left"></i> Add Video
            </a>
            <br /><br />
          </div>
          <div className="col s12 m4">
            <a href={this.getModel().get('textbook')} target="_blank" className="waves-effect waves-teal btn">
              <i className="fa fa-book left"></i> Textbook
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col s3" style={{ overflowX: 'scroll' }}>
            <table className="striped">
              <thead>
                <tr>
                  <th style={{ padding: '2rem 0 1.75rem' }}>Name</th>
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
                  <th>
                    <div className="input-field trim-margin">
                      <input id="grade" type="text" ref="grade" onBlur={this.addGrade} className="trim-margin" style={{minWidth:'100px'}} />
                      <label htmlFor="grade" className="nowrap">Add Grade</label>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentGrades}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <h4>Attendance</h4>
            <LineChart data={this.getModel().attendanceOverTime().data} ref="attendanceChart" options={this.getModel().attendanceOverTime().options} />
            <canvas ref="heatmap"></canvas>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6">
            <div className="card">
              <div className="card-content">
                <span className="card-title">Video Manager</span>
                {videos}
              </div>
            </div>
          </div>
        </div>
        <BaseModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={false}>
          <CourseVideoUpload model={this.getModel()} />
        </BaseModal>
      </div>
    );
  }
});
