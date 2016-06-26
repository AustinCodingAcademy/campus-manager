var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var UserModalComponent = React.createFactory(require('./UserModalComponent'));
var Barcode = require('react-barcode');
var moment = require('moment');
var DoughnutChart = require('react-chartjs').Doughnut;

module.exports = React.createBackboneClass({
  userModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(UserModalComponent({
      collection: this.getCollection(),
      model: this.getModel(),
      rolesHidden: true
    }), $('#modal-container')[0]);
    $('#user-modal' + this.getModel().id).openModal();
    Materialize.updateTextFields();
  },

  changeAttendance: function(e) {
    var that = this;
    if (!this.props.currentUser.get('is_student')) {
      $.ajax('/api/users/attendance', {
        method: 'post',
        data: {
          idn: that.getModel().get('idn'),
          date: $(e.currentTarget).data('date')
        },
        success: function() {
          that.getModel().fetch();
        }
      });
    }
  },

  render: function() {
    var courseCards = this.getModel().get('courses').map(function(course, idx) {
      var dates = _.map(course.classDates(), function(date, idx) {
        var attended = 'fa fa-calendar-o';
        if (date.isSameOrBefore(moment(), 'day')) {
          attended = 'fa fa-calendar-times-o red-text';
          var matched = _.find(this.getModel().get('attendance'), function(attended) {
            return moment(attended, 'YYYY-MM-DD HH:mm').isSame(date, 'day');
          });
          if (matched) {
            attended = 'fa fa-calendar-check-o green-text';
          }
        }
        var video = _.findWhere(course.get('videos'), { timestamp: date.format('YYYY-MM-DD') });
        if (video) {
          return (
            <p className='nowrap' key={idx}><i className={attended} onClick={this.changeAttendance} data-date={date.format('YYYY-MM-DD HH:ss')}></i> <a href={video.link} target="_blank">{date.format("ddd, MMM D")}</a></p>
          );
        } else {
          return (
            <p className='nowrap' key={idx}><i className={attended} onClick={this.changeAttendance} data-date={date.format('YYYY-MM-DD HH:ss')}></i> {date.format("ddd, MMM D")}</p>
          );
        }
      }, this);

      var grades = _.map(_.where(this.getModel().get('grades'), { courseId: course.id }), function(grade, idx) {
        return (
          <p key={idx}>{grade.name}: <span className={'score'+ grade.score}>{grade.score}</span></p>
        );
      });
      var clearfix = idx === 0 ? 'clearfix' : '';
      return (
        <div key={idx} className={'col s12 m6 l4 ' + clearfix}>
          <div className="card">
            <div className="card-content">
              <span className="card-title">
                <a href={course.get('textbook')} target="_blank">
                  <i className="fa fa-book fa-fw"></i>
                  {course.get('term').get('name') + ' - ' + course.get('name')}
                </a>
              </span>
              <div className="row">
                <div className="col s6">
                  <h5>Attendance</h5>
                  {dates}
                </div>
                <div className="col s6">
                  <h5>Grades</h5>
                  {grades}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }, this);

    return (
      <div>
        <div className="row">
          <div className="col s12 m6 l4">
            <div className="card">
              <div className="card-content">
                <span className="card-title">
                  {this.getModel().get('first_name') + ' ' + this.getModel().get('last_name')}
                </span>
                <p><i className="fa fa-fw fa-hashtag"></i> {this.getModel().get('idn')}</p>
                <p>
                  <i className="fa fa-fw fa-envelope"></i>
                  <a href={'mailto:' + this.getModel().get('username')}>
                    {this.getModel().get('username')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-mobile"></i> {this.getModel().get('phone')}
                </p>
                <p>
                  <i className="fa fa-fw fa-github"></i>
                  <a href={'https://github.com/' + this.getModel().get('github')}>
                    {this.getModel().get('github')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-globe"></i>
                  <a href={this.getModel().get('website')}>
                    {this.getModel().get('website')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-code"></i>
                  <a href={'https://codecademy.com/' + this.getModel().get('codecademy')}>
                    {this.getModel().get('codecademy')}
                  </a>
                </p>
                <p><i className="fa fa-fw fa-map-marker"></i> {this.getModel().get('zipcode')}</p>
              </div>
              <div className="card-action">
                <a className="waves-effect waves-teal btn-flat modal-trigger" onClick={this.userModal}>
                  Edit
                </a>
              </div>
            </div>
          </div>
          <div className="col s12 m6 l4">
            <div className="card">
              <div className="card-content">
                <p className="center-align">
                  <Barcode value={'' + this.getModel().get('idn')} format={'CODE128'} />
                </p>
              </div>
            </div>
          </div>
          <div className="col s12 m6 l4">
            <div className="card">
              <div className="card-content">
                <span className="card-title">Grade Average: <span className={'score'+ this.getModel().get('gradeAverage')}>{this.getModel().get('gradeAverage')}%</span></span>
                <p className="center-align">
                  <DoughnutChart data={this.getModel().averageChartData(this.getModel().get('gradeAverage')).chart} options={this.getModel().averageChartData(this.getModel().get('gradeAverage')).options} />
                </p>
              </div>
            </div>
          </div>
          <div className="col s12 m6 l4">
            <div className="card">
              <div className="card-content">
                <span className="card-title">Attendance: <span className={'score'+ this.getModel().attendanceAverage()}>{this.getModel().attendanceAverage()}%</span></span>
                <p className="center-align">
                  <DoughnutChart data={this.getModel().averageChartData(this.getModel().attendanceAverage()).chart} options={this.getModel().averageChartData(this.getModel().attendanceAverage()).options} />
                </p>
              </div>
            </div>
          </div>
          {courseCards}
        </div>
      </div>
    );
  }
});
