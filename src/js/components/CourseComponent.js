import * as _ from 'underscore';
import * as React from 'react';
const moment = require('moment');
var BaseModal = require('./BaseModal');
var CourseVideoUpload = require('./CourseVideoUpload');
const CourseAttendanceComponent = require('./CourseAttendanceComponent');
const utils = require('../utils');
import {
  Col, Row, Button, ButtonGroup, Table, FormControl, FormGroup,
  ControlLabel, Panel, Checkbox, ListGroup, ListGroupItem, InputGroup
} from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const DatePicker = require('react-datepicker');
const GradeModel = require('../models/GradeModel');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      modalIsOpen: false,
      videoDate: moment(),
      holidayDate: moment()
    };
  },

  addGrade(e) {
    e.preventDefault();
    var gradeName = e.currentTarget.value;
    if (gradeName && !this.getModel().get('grades').find((grade) => {
      return grade.name === gradeName;
    })) {
      this.getModel().get('grades').push({
        name: gradeName,
        checkpoint: false
      });
      this.getModel().save();
    }
    e.currentTarget.value = '';
  },

  removeGrade(e) {
    e.preventDefault();
    const gradeIdx = e.currentTarget.getAttribute('data-grade-idx');
    const grade = this.getModel().get('grades')[gradeIdx];
    if (confirm('Are you sure you want to delete ' + grade.name + '?')) {
      this.getModel().get('grades').splice(gradeIdx, 1);
      this.getModel().save();
    }
  },

  toggleCheckpoint(e) {
    e.preventDefault();
    var gradeIdx = e.currentTarget.getAttribute('data-grade-idx');
    this.getModel().get('grades')[gradeIdx].checkpoint = !this.getModel().get('grades')[gradeIdx].checkpoint;
    this.getModel().save();
  },

  addHoliday(e) {
    e.preventDefault();
    const holidays = this.getModel().get('holidays').splice(0);
    const idx = holidays.indexOf(e.currentTarget.getAttribute('data-date'));
    if (idx === -1) {
      holidays.push(e.currentTarget.getAttribute('data-date'));
      this.getModel().save({ holidays });
    }
  },

  removeHoliday(e) {
    e.preventDefault();
    const holidays = this.getModel().get('holidays').splice(0);
    const idx = holidays.indexOf(e.currentTarget.getAttribute('data-date'));
    if (idx > -1) {
      holidays.splice(idx, 1);
      this.getModel().save({ holidays });
    }
  },

  handleHolidayChange: function(date) {
    this.setState({
      holidayDate: date
    });
  },

  handleVideoDateChange: function(date) {
    this.setState({
      videoDate: date
    });
  },

  blurGrade(e) {
    e.persist();
    const student = this.getModel().get('registrations').get(e.target.getAttribute('data-student-id'));
    const gradeIdx = _.findIndex(student.get('grades'), grade => {
      return grade.courseId === this.getModel().id && grade.name === e.target.getAttribute('data-grade-name');
    });
    const originalScore = student.get('grades')[gradeIdx].score;

    const grade = new GradeModel();
    const score = e.target.value === '' ? '' : Number(e.target.value);
    grade.save({
      userId: student.id,
      name: e.target.getAttribute('data-grade-name'),
      score,
      courseId: this.getModel().id
    }, {
      success: () => {
        student.get('grades')[gradeIdx].score = score;
        this.getModel().trigger('change');
      },
      error: () => {
        e.target.value = originalScore;
        student.get('grades')[gradeIdx].score = originalScore;
        this.getModel().trigger('change');
      }
    });
  },

  // I'm thinking how we show modals is in need of an update. Going into the dom
  // like this seems like an anti-pattern.  We would probably be better off
  // having some type of modal component and passing it a child component.
  // We would be less likely to run into weird bugs as a result of
  // repeating this logic over and over again
  //
  // <Modal> <CourseVideoUpload /> </Modal>
  showUploadModal(e) {
    e.preventDefault();
    this.setState({modalIsOpen: true});
  },

  closeModal() {
    this.setState({modalIsOpen: false});
  },

  removeVideo(e) {
    e.preventDefault();
    if (confirm("You sure you wanna delete this video?")) {
      const idx = e.currentTarget.getAttribute('data-idx');
      this.getModel().get('videos').splice(idx, 1);
      this.getModel().save();
    }
  },

  saveVideo(e) {
    e.preventDefault();
    const timestamp = this.state.videoDate.format('YYYY-MM-DD')
    const match = this.getModel().get('videos').find(video => {
      return video.timestamp === timestamp;
    });
    if (!match) {
      const link = document.getElementById('video-link');
      this.getModel().get('videos').push({
        link: link.value,
        youtubeId: link.value.replace('https://www.youtube.com/watch?v=','').replace('https://youtu.be/',''),
        timestamp
      });
      this.getModel().save(null, {
        success: () => {
          this.setState({
            videoDate: moment()
          });
          link.value = '';
        }
      });
    }
  },

  changeDueDate(e) {
    this.getModel().get('grades').find(grade => {
      return grade.name === e.currentTarget.getAttribute('data-grade-name');
    }).dueDate = e.currentTarget.value;
    this.getModel().save();
  },

  render() {
    var userRows = this.getModel().get('registrations').map((student, i) => {
      const studentCheckpointScores = [];
      const studentDailyScores = [];
      const courseGrades = _.each(_.filter(_.where(student.get('grades'), { courseId: this.getModel().id }), grade => {
        return _.isNumber(grade.score);
      }), grade => {
        const courseGrade = _.findWhere(this.getModel().get('grades'), { name: grade.name });
        if (courseGrade) {
          if (courseGrade.checkpoint) {
            studentCheckpointScores.push(Number(grade.score));
          } else {
            studentDailyScores.push(Number(grade.score));
          }
        }
      });
      const courseAverage = utils.weightedGradeAverage(studentCheckpointScores, studentDailyScores);

      return (
        <tr key={i}>
          <td className="right-align nowrap" style={{height: '51px', padding: '0 5px'}}>
            <a href={'#users/' + student.id}>{student.fullName()}</a>
            <br />
            <small>Avg: <span className={'score' + courseAverage}>{courseAverage}</span></small>
          </td>
        </tr>
      );
    });

    const gradeNames = _.map(this.getModel().get('grades'), (grade, idx) => {
      const assignmentGrades = [];
      this.getModel().get('registrations').each(student => {
        const match = _.findWhere(student.get('grades'), { name: grade.name, courseId: this.getModel().id });
        if (!match) {
          student.get('grades').push({
            courseId: this.getModel().id,
            name: grade.name,
            score: ''
          });
        } else {
          if (_.isNumber(match.score)){
            assignmentGrades.push(match.score);
          }
        }
      });

      const assignmentAverage = Math.round(_.reduce(assignmentGrades, (memo, num) => { return memo + num; }) / assignmentGrades.length) || 0;
      return (
        <td key={idx} className='nowrap'>
          {grade.name}
          <sup>
            <a href="#" onClick={this.removeGrade} data-grade-idx={idx} className="link-danger">
              <FontAwesome name="times" />
            </a>
          </sup>
          <br />
          <small>
            { grade.dueDate ?
              <FontAwesome name="calendar-check-o" />
              :
              <FontAwesome name="calendar-o" />
            }
            &nbsp;&nbsp;
            <FormControl
              type="date"
              onChange={this.changeDueDate}
              data-grade-name={grade.name}
              style={{ display: 'inline', width: '160px', height: '18px' }}
              defaultValue={grade.dueDate}
            />
          </small>
          <br />
          <Checkbox
            checked
            data-grade-idx={idx}
            checked={grade.checkpoint}
            onChange={this.toggleCheckpoint}
            style={{display: 'inline'}}
            >
            <small>CP</small>
          </Checkbox>
          &nbsp;
          <small className="pull-right">
            Avg:
            <span className={'score' + assignmentAverage}>
              {assignmentAverage}
            </span>
          </small>
        </td>
      );
    });

    const studentGrades = this.getModel().get('registrations').map(student => {
      const courseGrades = _.filter(student.get('grades'), grade => {
        return grade.courseId === this.getModel().id && _.findWhere(this.getModel().get('grades'), { name: grade.name });
      });

      courseGrades.sort((a, b) => {
        return this.getModel().get('grades').findIndex(grade => {
          return grade.name === a.name;
        }) < this.getModel().get('grades').findIndex(grade => {
          return grade.name === b.name;
        }) ? -1 : 1;
      });

      const studentCells = _.map(courseGrades, (grade, idx) => {
        return (
          <td key={`${student.id}-${idx}`}>
            <InputGroup>
              <FormControl
                type="text"
                defaultValue={grade.score}
                onBlur={this.blurGrade}
                data-student-id={student.id}
                data-grade-name={grade.name}
              />
              <InputGroup.Button>
                {grade.url ?
                  <Button href={grade.url} target="_blank">
                    <FontAwesome name="external-link"/>
                  </Button>
                  :
                  <Button disabled={true}>
                    <FontAwesome name="times"/>
                  </Button>
                }
              </InputGroup.Button>
            </InputGroup>
          </td>
        );
      }, this);

      return (
        <tr key={student.id}>
        {studentCells}
        </tr>
      );
    });

    const emails = this.getModel().get('registrations').map(student => {
      return student.get('username');
    });

    const videos = _.map(this.getModel().get('videos'), (video, idx) => {
      return (
        <tr key={idx}>
          <td>
            {moment(video.timestamp, 'YYYY-MM-DD').format('ddd, MMM Do')}
          </td>
          <td>
            <small>
              <a href={video.link} target="_blank">{video.link}</a>
            </small>
          </td>
          <td>
            <a href="#" data-idx={idx} onClick={this.removeVideo} className="link-danger">
              <FontAwesome name="trash-o" />
            </a>
          </td>
        </tr>
      );
    }, this);

    const holidays = this.getModel().get('holidays').map(holiday => {
      return (
        <ListGroupItem key={holiday}>
          {moment(holiday, 'YYYY-MM-DD').format('ddd, MMM D')}
            <a href="#" className="link-danger pull-right" onClick={this.removeHoliday} data-date={holiday}>
              <FontAwesome name="trash-o" />
            </a>
        </ListGroupItem>
      );
    });

    const classDates = this.getModel().classDates().map(date => {
      return (
        <ListGroupItem key={date.format('YYYY-MM-DD')} data-date={date.format('YYYY-MM-DD')}>
          {date.format('ddd, MMM D')}
          <a href="#" className="pull-right" onClick={this.addHoliday} data-date={date.format('YYYY-MM-DD')}>
            <FontAwesome name="arrow-right" />
          </a>
        </ListGroupItem>
      )
    });

    return (
      <div>
        <Row>
          <Col xs={12} md={4}>
            <h4>{this.getModel().get('term').get('name')}</h4>
            <h2 style={{marginTop: '10px'}}>{this.getModel().get('name')}</h2>
          </Col>
          <Col xs={12} md={8} className="text-right">
            <h5>Daily Attendance Code: <strong>{utils.attendanceCode()}</strong></h5>
            <ButtonGroup>
              <a
                className="btn btn-default"
                href={'mailto:' + this.props.currentUser.get('username') + '?bcc=' + emails}
                target="_blank"
              >
                <FontAwesome name="envelope" />
                &nbsp; Email Class
              </a>
              <a
                className="btn btn-default"
                href={this.getModel().get('textbook').get('instructor_url')}
                target="_blank"
              >
                <FontAwesome name="book" />
                &nbsp; View Textbook
              </a>
              <a href={utils.jitsiUrl(this.getModel())} target="_blank" className="btn btn-default">
                <FontAwesome name="video-camera" />
                &nbsp; Virtual Classroom
              </a>
            </ButtonGroup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <Panel
              header={<h3>Grades</h3>}
              footer={
                <small>
                  CP: Signifies the grade is a checkpoint. Checkpoints are
                  weighted more and are used as markers in the student&#39;s
                  understanding of the content.
                </small>
              }
            >
              <Row>
                <Col xs={3} style={{ overflowX: 'scroll' }}>
                  <Table striped>
                    <thead>
                      <tr>
                        <th style={{ padding: '2rem 0 3.5rem', borderBottom: 'none' }}>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRows}
                    </tbody>
                  </Table>
                </Col>
                <Col xs={9} style={{overflowX: 'scroll'}}>
                  <Table striped>
                    <thead>
                      <tr>
                        {gradeNames}
                        <th style={{borderBottom: 'none'}}>
                          <FormGroup controlId="new-grade">
                            <FormControl
                              type="text"
                              placeholder="Add Grade"
                              onBlur={this.addGrade}
                              style={{minWidth:'100px'}}
                            />
                          </FormGroup>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentGrades}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={7}>
            <Panel
              header={<h3>Screencasts</h3>}
              footer={
                <small>
                  One video per date. Link to additional videos in the YouTube
                  comments. Date must be on class day for students to see it.
                  Be sure to upload to &nbsp;
                  <a
                    href="https://www.youtube.com/channel/UCzNpMM1lxoyj8paRCZoq5mA"
                    target="_blank">
                      ACA Class Screencasts
                  </a>
                  &nbsp; channel and set the video to "unlisted".
                </small>
              }
            >
              <form onSubmit={this.saveVideo}>
                <Table striped>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>YouTube Link</th>
                      <th style={{minWidth: '140px'}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos}
                    <tr>
                      <td>
                        <DatePicker
                          dateFormat="ddd, MMM D"
                          selected={this.state.videoDate}
                          className="form-control"
                          onChange={this.handleVideoDateChange}
                        />
                      </td>
                      <td>
                        <FormControl
                          type="text"
                          placeholder="YouTube Link"
                          id="video-link"
                        />
                      </td>
                      <td>
                        <ButtonGroup>
                          <Button bsStyle="primary" type="submit">Save</Button>
                          <Button onClick={this.showUploadModal}>Upload</Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </form>
            </Panel>
          </Col>
          <Col xs={12} md={5}>
            <Panel header={<h3>Class Dates</h3>}>
              <Row>
                <Col xs={6}>
                  <h4>Class Dates</h4>
                  <ListGroup>
                    {classDates}
                  </ListGroup>
                </Col>
                <Col xs={6}>
                  <h4>Holidays</h4>
                  <ListGroup>
                    {holidays}
                  </ListGroup>
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>
        <CourseAttendanceComponent model={this.getModel().get('attendance')} />
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
