import * as React from 'react';
import * as _ from 'underscore';
const utils = require('../utils');
import { Checkbox } from 'react-bootstrap';
const moment = require('moment');
const DatePicker = require('react-datepicker');

module.exports = React.createBackboneClass({
  mixins: [
    React.BackboneMixin('course', 'change:withdrawals')
  ],

  getInitialState() {
    const withdrawal = this.props.course.get('withdrawals').find(wd => { return wd.userId === this.getModel().id; });
    return {
      withdrawal: withdrawal,
      withdrawalDate: withdrawal ? moment(Number(withdrawal.timestamp)) : moment(),
      changeWithdrawalDate: false
    };
  },

  toggleWithdrawal(e) {
    const withdrawal = this.props.course.get('withdrawals').find(wd => {
      return wd.userId === this.getModel().id;
    });
    let method;
    if (withdrawal) {
      method = 'DELETE';
    } else {
      method  = 'POST';
    }

    $.ajax('/api/withdrawals', {
      method,
      data: {
        userId: this.getModel().id,
        courseId: this.props.course.id
      },
      success: () => {
        this.props.course.fetch({
          success: () => {
            const withdrawal = this.props.course.get('withdrawals').find(wd => {
              return wd.userId === this.getModel().id;
            });
            if (withdrawal) {
              this.setState({
                withdrawal,
                withdrawalDate: moment(withdrawal.timestamp)
              })
            } else {
              this.setState({ withdrawal: false });
            }

          }
        });
      }
    });
  },

  handleWithdrawalDateChange(date) {
    console.log(date);
    $.ajax('/api/withdrawals', {
      method: 'PUT',
      data: {
        userId: this.getModel().id,
        courseId: this.props.course.id,
        timestamp: date.valueOf()
      },
      success: () => {
        this.props.course.fetch();
        this.setState({
          changeWithdrawalDate: false,
          withdrawalDate: date
        });
      }
    });
  },

  toggleChangeWithdrawalDate(e) {
    e.preventDefault();
    this.setState({
      changeWithdrawalDate: true
    });
  },

  render() {
    const studentCheckpointScores = [];
    const studentDailyScores = [];
    const courseGrades = _.each(_.filter(_.where(this.getModel().get('grades'), { courseId: this.props.course.id }), grade => {
      return _.isNumber(grade.score);
    }), grade => {
      const courseGrade = _.findWhere(this.props.course.get('grades'), { name: grade.name });
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
      <tr>
        <td className="right-align nowrap" style={{height: '51px', padding: '0 5px'}}>
          <a href={'#users/' + this.getModel().id}>{this.getModel().fullName()}</a>
          <br />
          <small>Avg: <span className={'score' + courseAverage}>{courseAverage}</span></small>
          <small className="pull-right text-right">
            <Checkbox
              data-student-id={this.getModel().id}
              checked={this.state.withdrawal}
              onChange={this.toggleWithdrawal}
              style={{display: 'inline'}}
            >
              WD
            </Checkbox>&nbsp;
            { this.state.withdrawal && this.state.changeWithdrawalDate ?
              <DatePicker
                dateFormat="MMM D, YYYY"
                selected={this.state.withdrawalDate}
                className="form-control"
                onChange={this.handleWithdrawalDateChange}
              />
            : ''
            }
            { this.state.withdrawal && !this.state.changeWithdrawalDate ?
            <a href='#' onClick={this.toggleChangeWithdrawalDate}>{this.state.withdrawalDate.format('MM-DD-YY')}</a>
            : ''
            }
          </small>
        </td>
      </tr>
    );
  }
});
