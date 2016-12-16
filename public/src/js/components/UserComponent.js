var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
require('react.backbone');
var BaseModal = require('./BaseModal');
var UserModalComponent = React.createFactory(require('./UserModalComponent'));
var Barcode = require('react-barcode');
var moment = require('moment');
var DoughnutChart = require('react-chartjs').Doughnut;
var Gravatar = require('react-gravatar');
var Hashids = require('hashids');
var hashids = new Hashids();
var TermsCollection = require('../collections/TermsCollection');
var CourseRegistrationComponent = require('./CourseRegistrationComponent');
var UserAccountComponent = require('./UserAccountComponent');
var ScreenShareModal = require('./ScreenShareModal');

module.exports = React.createBackboneClass({

  getInitialState: function() {
    return {
      modalIsOpen: false,
      screenShareModalIsOpen: false
    };
  },

  userModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(UserModalComponent({
      collection: this.getCollection(),
      model: this.getModel(),
      rolesHidden: true
    }), $('#modal-container')[0]);
    $('#user-modal' + this.getModel().id).modal('open');
    Materialize.updateTextFields();
  },

  showScreenShareModal: function(e) {
    e.preventDefault();
    this.setState({screenShareModalIsOpen: true});
  },

  closeScreenShareModal: function() {
    this.setState({screenShareModalIsOpen: false});
  },

  checkIn: function(date) {
    var that = this;
    $.ajax('/api/users/attendance', {
      method: 'post',
      data: {
        idn: this.getModel().get('idn'),
        date: date
      },
      success: function() {
        that.getModel().fetch();
      }
    });
  },

  changeAttendance: function(e) {
    if (this.props.currentUser.get('is_admin') || this.props.currentUser.get('is_instructor')) {
      this.checkIn($(e.currentTarget).data('date'));
    } else if (moment($(e.currentTarget).data('date'), 'YYYY-MM-DD HH:mm').isSame(moment(), 'day')) {
      var code = prompt('Enter Daily Attendance Code');
      var hash = hashids.encode(Number(moment().format('YYYY-MM-DD').split('-').join(''))).slice(0, 4).toUpperCase();
      if (code && code.toUpperCase() === hash) {
        this.checkIn($(e.currentTarget).data('date'));
      }
    }
  },

  generateApiKey: function(e) {
    e.preventDefault();
    var that = this;
    this.getModel().save({
      generate_api_key: true
    }, {
      success: function() {
        if (that.getModel().id === that.props.currentUser.id) {
          that.props.currentUser.set('api_key', that.getModel().get('api_key'));
        }
      }
    });
    this.getModel().unset('generate_api_key', { silent: true });
  },

  render: function() {
    var userAccountModel = new Backbone.Model({
      totalPaid: 0,
      totalCourseCost: 0,
      courseCharges: []
    });

    var courseCards = this.getModel().get('courses').map(function(course, idx) {
      if (course.get('cost') && course.get('cost') > 0) {
        userAccountModel.set('totalCourseCost', userAccountModel.get('totalCourseCost') + course.get('cost'));
        userAccountModel.get('courseCharges').push(
          <tr key={course.id + course.get('cost')}>
            <td>${Number(this.getModel().get('price') || course.get('cost')).toFixed(2)}</td>
            <td>{course.get('name')}</td>
          </tr>
        )
      }
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
                  {course.get('name')}
                </a>
              </span>
              <br />
              <br />
              <a href={'https://jitsi.austincodingacademy.com/' + hashids.encode([moment.utc(course.get('createdAt')).unix(), moment().format('MMDDYYYY')])} target="_blank">
                <i className="fa fa-video-camera"></i> Conference
              </a>
              <br />
              <small><a href="#" onClick={this.showScreenShareModal}><i className="fa fa-info-circle" aria-hidden="true"></i> Screenshare Instructions</a></small>
              <br />
              <br />
              <p dangerouslySetInnerHTML={{__html:course.get('location').locationAddress().split('\n').join('<br />')}}></p>
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

    _.each(
        _.filter(this.getModel().get('credits').trim().split(',').map(function(credit) {
          return _.map(credit.trim().split(':'), function(item) {
            return item.trim();
          });
        }), function(credit) {
      return credit.length === 2 && Number(credit[1]);
    }), (credit, idx) => {
      userAccountModel.set('totalCourseCost', userAccountModel.get('totalCourseCost') - Number(credit[1]));
      userAccountModel.get('courseCharges').push(
        <tr key={idx}>
          <td>(- ${Number(credit[1]).toFixed(2)})</td>
          <td>{credit[0]}</td>
        </tr>
      );
    });

    var terms = new TermsCollection();
    terms.fetch({
      success: function() {
        terms.reset(terms.filter(function(term) {
          return moment.utc(term.get('start_date')).isAfter(moment());
        }));
        terms.trigger('add');
      }
    });

    if (userAccountModel.get('totalPaid') - userAccountModel.get('totalCourseCost') < 0) {
      userAccountModel.set('status', -1);
    } else if (userAccountModel.get('totalPaid') - userAccountModel.get('totalCourseCost') < 490) {
      userAccountModel.set('status', 0);
    }

    var hidden = this.props.currentUser.get('is_admin') || this.props.currentUser.id === this.getModel().id ? '' : ' hidden';

    return (
      <div>
        <div className="row">
          <div className="col s12 m6 l4">
            <div className="card">
              <div className="card-content">
                <span className="card-title">
                  <div className="valign-wrapper">
                    <a className={hidden} onClick={this.userModal} style={{position: 'absolute', right: '10px', top: '0px'}}>
                      <i className="material-icons">mode_edit</i>
                    </a>
                    <a href="http://en.gravatar.com/" target="_blank">
                      <Gravatar email={this.getModel().get('username')} className="circle" protocol="https://" />
                    </a>
                    <div className="valign">
                      &nbsp;&nbsp;{this.getModel().get('first_name') + ' ' + this.getModel().get('last_name')}
                    </div>
                  </div>
                </span>
                <p>
                  <i className="fa fa-fw fa-envelope"></i>
                  <a className="blue-text text-darken-2" href={'mailto:' + this.getModel().get('username')} target="_blank">
                    {this.getModel().get('username')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-mobile"></i>
                  <a className="blue-text text-darken-2" href={'tel:'+ this.getModel().get('phone')}>
                    <span className="hidden">Phone: </span>{this.getModel().get('phone')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-github"></i>
                  <a className="blue-text text-darken-2" title={'GitHub Account'} href={'https://github.com/' + this.getModel().get('github')} target="_blank">
                    {this.getModel().get('github')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-globe"></i>
                  <a className="blue-text text-darken-2" title={'Website'} href={this.getModel().get('website')} target="_blank">
                    {this.getModel().get('website')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-code"></i>
                  <a className="blue-text text-darken-2" title={'CodeAcademy Account'} href={'https://codecademy.com/' + this.getModel().get('codecademy')} target="_blank">
                    {this.getModel().get('codecademy')}
                  </a>
                </p>
                <p>
                  <i className="fa fa-fw fa-map-marker"></i>
                  <a className="blue-text text-darken-2" href={'https://maps.google.com/?q=' + this.getModel().get('zipcode')} target="_blank">
                    <span className="hidden">ZIP: </span>{this.getModel().get('zipcode')}
                  </a>
                </p>
                <div aria-hidden="true" className="center-align" style={{position: 'absolute', right: '-20px', bottom: '95px', width: '100px'}}>
                  <span className={'score' + this.getModel().profileComplete()}>{this.getModel().profileComplete() + '%'}</span><br />
                  <DoughnutChart data={this.getModel().averageChartData(this.getModel().profileComplete()).data} options={this.getModel().averageChartData(this.getModel().profileComplete()).options} />
                  <small>Profile</small>
                </div>
              </div>
              <div className="card-action trim-padding">
                <div className="center-align">
                  <Barcode value={'' + this.getModel().get('idn')} format={'CODE128'} height={40} width={4} />
                </div>
              </div>
            </div>
          </div>
          {this.getModel().get('is_admin') ?
          <div className="col s12 m6 l6">
            <div className="card">
              <div className="card-content">
                <span className="card-title">Admin Tips</span>
                <p>New User Registration can be found at</p>
                <small><pre>{process.env.DOMAIN + '/register/' + this.getModel().get('client')}</pre></small>
                <p>Users can reset their password at</p>
                <small><pre>{process.env.DOMAIN + '/reset'}</pre></small>
                <p>Your API Key is</p>
                <small><pre>{this.getModel().get('api_key')}</pre> <a href="#" onClick={this.generateApiKey}>generate</a></small>
              </div>
            </div>
          </div>
          :
          ''
          }
          {this.getModel().get('courses').length ?
          <div className="col s12 m6 l4">
            <div className="card">
              <div className="card-content">
                <span className="card-title">Grade Average: <span className={'score'+ this.getModel().gradeAverage()}>{this.getModel().gradeAverage()}%</span></span>
                <p aria-hidden="true" className="center-align">
                  <DoughnutChart data={this.getModel().averageChartData(this.getModel().gradeAverage()).data} options={this.getModel().averageChartData(this.getModel().gradeAverage()).options} />
                </p>
              </div>
            </div>
          </div>
          : ''}
          {this.getModel().get('courses').length ?
          <div className="col s12 m6 l4">
            <div className="card">
              <div className="card-content">
                <span className="card-title">Attendance: <span className={'score'+ this.getModel().attendanceAverage()}>{this.getModel().attendanceAverage()}%</span></span>
                <p aria-hidden="true" className="center-align">
                  <DoughnutChart data={this.getModel().averageChartData(this.getModel().attendanceAverage()).data} options={this.getModel().averageChartData(this.getModel().attendanceAverage()).options} />
                </p>
              </div>
            </div>
          </div>
          : ''}
        </div>
        {this.getModel().get('is_student') ?
        <div className="row">
            <div className="col s12 m6">
              <CourseRegistrationComponent user={this.getModel()} collection={terms} model={userAccountModel}/>
            </div>
            <div className="col s12 m6">
              <UserAccountComponent model={this.getModel()} userAccountModel={userAccountModel} user={this.getModel()} terms={terms} paymentModel = {new Backbone.Model({ paymentAmount: 0, username: '' })}/>
            </div>
          </div>
        :
        ''
        }
        <div className="row">
          {courseCards}
        </div>
        <BaseModal
          isOpen={this.state.screenShareModalIsOpen}
          onRequestClose={this.closeScreenShareModal}
          shouldCloseOnOverlayClick={true}>
          <ScreenShareModal />
        </BaseModal>
      </div>
    );
  }
});
