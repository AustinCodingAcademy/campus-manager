import * as _ from 'underscore';
import * as React from 'react';
import * as Backbone from 'backbone';
const moment = require('moment');
import { Doughnut } from 'react-chartjs';
import { Col, Row, Panel, PanelGroup, Table, Well, ControlLabel } from 'react-bootstrap';
const Gravatar = require('react-gravatar');
import Equalizer from 'react-equalizer';
const Hashids = require('hashids');
const hashids = new Hashids();
const FontAwesome = require('react-fontawesome');
const TermsCollection = require('../collections/TermsCollection');
const UserAccountComponent = require('./UserAccountComponent');
const UserModalComponent = require('./UserModalComponent');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      user: this.getModel(),
      activeKey: this.getModel().currentCourse().id
    }
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    this.setState({
      showModal: true,
    });
  },

  checkIn(date) {
    $.ajax('/api/users/attendance', {
      method: 'post',
      data: {
        idn: this.getModel().get('idn'),
        date: date
      },
      success: () => {
        this.getModel().fetch();
      }
    });
  },

  changeAttendance(e) {
    e.preventDefault();
    const date = e.currentTarget.getAttribute('data-date');
    if (this.props.currentUser.get('is_admin') || this.props.currentUser.get('is_instructor')) {
      this.checkIn(date);
    } else if (moment(date, 'YYYY-MM-DD HH:mm').isSame(moment(), 'day')) {
      const code = prompt('Enter Daily Attendance Code');
      const hash = hashids.encode(Number(moment().format('YYYY-MM-DD').split('-').join(''))).slice(0, 4).toUpperCase();
      if (code && code.toUpperCase() === hash) {
        this.checkIn(date);
      }
    }
  },

  generateApiKey(e) {
    e.preventDefault();
    this.getModel().save({
      generate_api_key: true
    }, {
      success: () => {
        if (this.getModel().id === this.props.currentUser.id) {
          this.props.currentUser.set('api_key', this.getModel().get('api_key'));
        }
      }
    });
    this.getModel().unset('generate_api_key', { silent: true });
  },

  handleSelect(activeKey) {
    this.setState({ activeKey });
  },

  render() {
    const courses = this.getModel().get('courses').map((course, i) => {
      const dates = course.classDates().map((date, j) => {
        let attended = <FontAwesome name="calendar-o" />;
        let matched;
        let checkin = <span>Absent</span>;
        const video = _.findWhere(course.get('videos'), { timestamp: date.format('YYYY-MM-DD') });
        if (date.isSameOrBefore(moment(), 'day')) {
          attended = <FontAwesome name="calendar-times-o" className="text-danger" />
          matched = _.find(this.getModel().get('attendance'), (attendedDate) => {
            return moment(attendedDate, 'YYYY-MM-DD HH:mm').isSame(date, 'day');
          });
          if (matched) {
            attended = <FontAwesome name="calendar-check-o" className="text-success" onClick={this.changeAttendance} data-date={date.format('YYYY-MM-DD HH:ss')} />
            checkin = <span>Present</span>
          }
        }
        if (!matched && (date.isSame(moment(), 'day') || this.props.currentUser.roles().some(role => ['instructor', 'admin'].includes(role)))) {
          checkin = <a href="#" onClick={this.changeAttendance} data-date={date.format('YYYY-MM-DD HH:ss')}>Check In</a>;
        }
        return (
          <tr key={`${i}-${j}`}>
            <td>{date.format("ddd, MMM D")}</td>
            <td>{attended} {checkin}</td>
            <td>
              { video ?
                <a href={video.link} target="_blank">
                  <FontAwesome name="youtube-play" />
                  &nbsp; Watch
                </a>
                : '' }
            </td>
          </tr>
        );
      });

      const grades = _.map(_.where(this.getModel().get('grades'), { courseId: course.id }), (grade, idx) => {
        return (
          <tr key={idx}>
            <td>{grade.name}</td>
            <td className={'score'+ grade.score}>{grade.score}</td>
          </tr>
        );
      });
      return (
        <Panel
          key={course.id}
          header={
            <h3>
              {course.get('name')}
              <small className="pull-right">
                {course.get('term').get('name')}
              </small>
            </h3>
          }
          eventKey={course.id}
        >
          <Row>
            <Col xs={12} md={4}>
              <h4 className="text-center">Details</h4>
              <Well bsSize="small">
                <Row>
                  <Col xs={6}>
                    <p>
                      <ControlLabel>Textbook</ControlLabel>
                      <br />
                      <a href={course.get('textbook')} target="_blank">
                      <FontAwesome name="book" fixedWidth={true} />
                      &nbsp; Textbook
                      </a>
                    </p>
                    <p>
                      <ControlLabel>Virtual Classroom</ControlLabel>
                      <br />
                      <a href={'https://jitsi.austincodingacademy.com/' + hashids.encode([moment.utc(course.get('createdAt')).unix(), moment().format('MMDDYYYY')])} target="_blank">
                        <FontAwesome name="video-camera" fixedWidth={true} />
                        &nbsp; Enter Room
                      </a>
                      <br />
                      <small>
                        <a
                          href="https://chrome.google.com/webstore/detail/aca-desktop-streamer/imnhhcdlfbbhajjgbagfagnjgkmfppcg"
                          target="_blank"
                        >
                          <FontAwesome name="info-circle" fixedWidth={true} />
                          &nbsp; Screenshare
                        </a>
                      </small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p>
                      <ControlLabel>Address</ControlLabel>
                      <br />
                      <a href={course.get('location').link()} target="_blank">
                        <strong>{course.get('location').get('name')}</strong>
                        <br />
                        {course.get('location').get('address')}
                        <br />
                        {`${course.get('location').get('city')}, ${course.get('location').get('state')}`}
                      </a>
                    </p>
                    <p>
                      <ControlLabel>Special Note</ControlLabel>
                      <br />
                      {course.get('location').get('note')}
                    </p>
                  </Col>
                </Row>
              </Well>
              <Row>
                <Col xs={6} md={12}>
                  <h4 className="text-center">Course Attendance</h4>
                  <h4 className={`score${this.getModel().courseAttendance(course)} text-center`}>
                    {this.getModel().courseAttendance(course)}%
                  </h4>
                  <p aria-hidden="true" className="center-align">
                    <Doughnut
                      data={this.getModel().averageChartData(this.getModel().courseAttendance(course)).data}
                      options={this.getModel().averageChartData(this.getModel().courseAttendance(course)).options}
                    />
                  </p>
                </Col>
                <Col xs={6} md={12}>
                  <h4 className="text-center">Course Grade Average</h4>
                  <h4 className={`score${this.getModel().courseGrade(course)} text-center`}>
                    {this.getModel().courseGrade(course)}%
                  </h4>
                  <p aria-hidden="true" className="center-align">
                    <Doughnut
                      data={this.getModel().averageChartData(this.getModel().courseGrade(course)).data}
                      options={this.getModel().averageChartData(this.getModel().courseGrade(course)).options}
                    />
                  </p>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={4}>
              <h4 className="text-center">Attendance</h4>
              <Table striped>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Attended</th>
                    <th>Screencast</th>
                  </tr>
                </thead>
                <tbody>
                  {dates}
                </tbody>
              </Table>
            </Col>
            <Col xs={12} md={4}>
              <h4 className="text-center">Grades</h4>
              <Table striped>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {grades}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Panel>
      );
    });

    const hidden = this.props.currentUser.get('is_admin') || this.props.currentUser.id === this.getModel().id ? '' : ' hidden';

    return (
      <div>
        <Row>
          <Equalizer>
            <Col xs={12} md={6} lg={4}>
              <Panel
                header={
                  <h3>
                    Profile
                    <a className={`${hidden} pull-right`} onClick={this.open}>
                      <FontAwesome name="pencil" fixedWidth={true} />
                    </a>
                  </h3>
                }
              >
                <h4>
                  <a
                    href="http://en.gravatar.com/"
                    target="_blank"
                    className="pull-left"
                    style={{marginRight: '1rem'}}
                  >
                    <Gravatar email={this.getModel().get('username')} protocol="https://" />
                  </a>
                  {this.getModel().get('first_name') + ' ' + this.getModel().get('last_name')}
                </h4>
                <p>
                  <a href={'mailto:' + this.getModel().get('username')} target="_blank">
                    {this.getModel().get('username')}
                  </a>
                </p>
                <p>
                  <FontAwesome name="globe" fixedWidth={true} />
                  &nbsp;
                  <a title={'Website'} href={this.getModel().get('website')} target="_blank">
                    {this.getModel().get('website')}
                  </a>
                </p>
                <Row>
                  <Col xs={6}>
                    <p>
                      <FontAwesome name="mobile" fixedWidth={true} />
                      &nbsp;
                      <a href={'tel:'+ this.getModel().get('phone')}>
                        {this.getModel().get('phone')}
                      </a>
                    </p>
                    <p>
                      <FontAwesome name="github" fixedWidth={true} />
                      &nbsp;
                      <a title={'GitHub Account'} href={'https://github.com/' + this.getModel().get('github')} target="_blank">
                        {this.getModel().get('github')}
                      </a>
                    </p>
                    <p>
                      <FontAwesome name="code" fixedWidth={true} />
                      &nbsp;
                      <a title={'CodeAcademy Account'} href={'https://codecademy.com/' + this.getModel().get('codecademy')} target="_blank">
                        {this.getModel().get('codecademy')}
                      </a>
                    </p>
                    <p>
                      <FontAwesome name="map-marker" fixedWidth={true} />
                      &nbsp;
                      <a href={'https://maps.google.com/?q=' + this.getModel().get('zipcode')} target="_blank">
                        {this.getModel().get('zipcode')}
                      </a>
                    </p>
                  </Col>
                  <Col xs={6} className="text-center">
                    <div aria-hidden="true">
                      <h4 className={'score' + this.getModel().profileComplete()}>{this.getModel().profileComplete() + '%'}</h4>
                      <Doughnut data={this.getModel().averageChartData(this.getModel().profileComplete()).data} options={this.getModel().averageChartData(this.getModel().profileComplete()).options} />
                      <small>
                        Profile
                        <br />
                        Complete
                      </small>
                    </div>
                  </Col>
                </Row>
              </Panel>
            </Col>
            {this.getModel().get('is_admin') ?
            <Col xs={12} md={6} lg={4}>
              <Panel header={<h3>Admin Tips</h3>}>
                <p>New User Registration can be found at</p>
                <small><pre>{process.env.DOMAIN + '/register/' + this.getModel().get('client')}</pre></small>
                <p>Users can reset their password at</p>
                <small><pre>{process.env.DOMAIN + '/reset'}</pre></small>
                <p>Your API Key is</p>
                <small><pre>{this.getModel().get('api_key')}</pre> <a href="#" onClick={this.generateApiKey}>generate</a></small>
              </Panel>
            </Col>
            :
            ''
            }
            {this.getModel().get('courses').length ?
            <Col xs={6} md={3} lg={2}>
              <Panel header={<h3>Overall Grade Average</h3>}>
                <h4 className={`score${this.getModel().overallGrade()} text-center`}>
                  {this.getModel().overallGrade()}%
                </h4>
                <p aria-hidden="true">
                  <Doughnut
                    data={this.getModel().averageChartData(this.getModel().overallGrade()).data}
                    options={this.getModel().averageChartData(this.getModel().overallGrade()).options}
                  />
                </p>
              </Panel>
            </Col>
            : ''}
          </Equalizer>
          {this.getModel().get('courses').length ?
          <Col xs={6} md={3} lg={2}>
            <Panel header={<h3>Overall Attendance</h3>}>
              <h4 className={`score${this.getModel().overallAttendance()} text-center`}>
                {this.getModel().overallAttendance()}%
              </h4>
              <p aria-hidden="true" className="center-align">
                <Doughnut
                  data={this.getModel().averageChartData(this.getModel().overallAttendance()).data}
                  options={this.getModel().averageChartData(this.getModel().overallAttendance()).options}
                />
              </p>
            </Panel>
          </Col>
          : ''}
          {this.getModel().get('is_student') ?
          <Col xs={12} lg={4}>
            <UserAccountComponent
              model={this.getModel()}
              terms={this.props.terms}
            />
          </Col>
          :
          ''
          }
          <Col xs={12}>
            <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
              {courses}
            </PanelGroup>
          </Col>
        </Row>
        <UserModalComponent
          show={this.state.showModal}
          onHide={this.close}
          model={this.state.user}
          title='Edit Profile'
          currentUser={this.props.currentUser}
        />
      </div>
    );
  }
});
