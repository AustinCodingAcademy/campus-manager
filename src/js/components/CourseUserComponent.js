import * as React from 'react';
import * as _ from 'underscore';
const utils = require('../utils');
import { Checkbox } from 'react-bootstrap';
const moment = require('moment');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      withdrawn: this.props.course.get('withdrawals').find(wd => { return wd.userId === this.getModel().id; })
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
        const withdrawal = this.props.course.get('withdrawals').find(wd => {
          return wd.userId === this.getModel().id;
        });
        if (withdrawal) {
          this.setState({ withdrawn: withdrawal });
        } else {
          this.setState({ withdrawn: true });
        }
        this.props.course.fetch();
      }
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
              checked
              data-student-id={this.getModel().id}
              checked={this.state.withdrawn}
              onChange={this.toggleWithdrawal}
              style={{display: 'inline'}}
            >
              WD
            </Checkbox>
            <div>{this.state.withdrawn ? moment(this.state.withdrawn.timestamp).format('MMM D, YYYY'): ''}</div>
          </small>
        </td>
      </tr>
    );
  }
});
