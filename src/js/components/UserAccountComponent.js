import * as React from 'react';
import * as _ from 'underscore';
const moment = require('moment');
const StripeCheckoutComponent = require('./StripeCheckoutComponent');
import {
  Row, Col, Panel, Table, FormGroup, InputGroup, FormControl, ControlLabel
} from 'react-bootstrap';
const Select = require('react-select');
const CourseOptionComponent = require('./CourseOptionComponent');
const CourseValueComponent = require('./CourseValueComponent');
const CourseModel = require('../models/CourseModel');
const CoursesCollection = require('../collections/CoursesCollection');

module.exports = React.createBackboneClass({
  mixins: [
    React.BackboneMixin('terms', 'update')
  ],

  getInitialState() {
    return {
      paymentAmount: 0,
      course: new CourseModel()
    };
  },

  setValue(value) {
    this.setState({
      course: value.course
    });
  },

  changeAmount(e) {
    this.setState({
      paymentAmount: Number(e.currentTarget.value) * 100
    });
  },

  render() {
    const courses = new CoursesCollection();
    courses.comparator = courses.reverse;
    const currentCourse = this.getModel().currentCourse();
    const futureCourse = this.getModel().futureCourse();
    let totalCourseCost = 0;
    const courseCharges = [];
    let totalPaid = 0;

    this.getModel().get('courses').each(course => {
      if (course.get('cost') && course.get('cost') > 0) {
        totalCourseCost += this.getModel().get('price') || course.get('cost');
        courseCharges.push(
          <tr key={course.id + course.get('cost')}>
            <td>$-{Number(this.getModel().get('price') || course.get('cost')).toFixed(2)}</td>
            <td>{course.get('name')} ({course.get('term').get('name')})</td>
          </tr>
        );
      }
    });

    _.each(
        _.filter(this.getModel().get('credits').trim().split(',').map(credit => {
          return _.map(credit.trim().split(':'), item => {
            return item.trim();
          });
        }), credit => {
      return credit.length === 2 && Number(credit[1]);
    }), (credit, idx) => {
      totalCourseCost -= Number(credit[1]);
      courseCharges.push(
        <tr key={idx}>
          <td>${Number(credit[1]).toFixed(2)}</td>
          <td>{credit[0]}</td>
        </tr>
      );
    });

    if (currentCourse && currentCourse.id && currentCourse.get('seats') > 0) {
      currentCourse.set('registered', true);
      courses.add(currentCourse);
    }

    if (futureCourse && futureCourse.get('seats') > 0) {
      futureCourse.set('registered', true);
      courses.add(futureCourse);
    } else {
      this.props.terms.each(term => {
        term.get('courses').each(course => {
          courses.add(course);
        });
      });
    }

    const options = [];

    courses.each(course => {
      const label = `${course.get('name')}
      ${course.get('location').get('name')}
      ${course.get('location').get('address')}
      ${course.get('location').get('city')}
      ${course.get('location').get('state')}
      ${course.get('location').get('zipcode')}`;
      options.push({
        value: course.id,
        label,
        course,
        user: this.getModel(),
        disabled: course.full() && !course.get('registered')
      });
    });

    const charges = _.map(_.filter(this.getModel().get('charges'), charge => {
      return charge.paid;
    }), charge => {
      totalPaid += ((charge.amount - charge.amount_refunded) / 100);
      return(
        <tr key={charge.created}>
          <td>{('$' + ((charge.amount - charge.amount_refunded) / 100).toFixed(2))}</td>
          <td>*{charge.source.last4}</td>
          <td>{moment.unix(charge.created).format('MM/DD/YY')}</td>
          <td>{charge.metadata && charge.metadata.course_name ? `${charge.metadata.course_name} (${charge.metadata.term_name})` : ''}</td>
        </tr>
      )
    });

    return (
      <Panel
        header={<h3>Account</h3>}
        footer={<small>Contact admissions to make a payment smaller than $490.00</small>}
      >
        <Row>
          <Col xs={12}>
            <Table striped>
              <thead>
                <tr>
                  <th>Cost</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>{courseCharges}</tbody>
              <tfoot></tfoot>
            </Table>
          </Col>
          <Col xs={12}>
            <Table striped>
              <thead>
                <tr>
                  <th>Paid</th>
                  <th>Card</th>
                  <th>Date</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>{charges}</tbody>
              <tfoot>
                <tr>
                  <th>
                    <span className={ totalPaid < totalCourseCost ? 'score60' : '' }>
                      ${(totalPaid - totalCourseCost).toFixed(2)}
                    </span>
                  </th>
                  <th>Balance</th>
                  <th></th>
                  <th></th>
                </tr>
              </tfoot>
            </Table>
          </Col>
          <Col xs={12}>
            <FormGroup controlId="course-payment">
              <ControlLabel>
                1. What are you paying for?
              </ControlLabel>
              <Select
                name="courses"
                options={options}
                optionComponent={CourseOptionComponent}
                placeholder="Select a course"
                valueComponent={CourseValueComponent}
                value={this.state.course.id}
                onChange={this.setValue}
                id="course-payment"
                data-test="course-payment"
              />
            </FormGroup>
            <FormGroup controlId="payment-amount">
              <ControlLabel>
                2. Enter Payment Amount
                <small>&nbsp; (Minimum payment is $490.00)</small>
              </ControlLabel>
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="0.00"
                  onChange={this.changeAmount}
                />
              </InputGroup>
            </FormGroup>
            <StripeCheckoutComponent
              model={this.getModel()}
              paymentAmount={this.state.paymentAmount}
              course={this.state.course}
              currentUser={this.props.currentUser}
            />
          </Col>
        </Row>
      </Panel>
    );
  }
});
