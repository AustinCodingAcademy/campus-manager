import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Backbone from 'backbone';
require('react.backbone');
import { Table, Tr, Td, Th, Thead } from 'reactable';
const FontAwesome = require('react-fontawesome');
import { Col, Row, Button } from 'react-bootstrap';
const CourseModalComponent = require('./CourseModalComponent.js');
const CourseModel = require('../models/CourseModel');
const LocationModel = require('../models/LocationModel');
const TermModel = require('../models/TermModel');
const TermsCollection = require('../collections/TermsCollection');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      course: new CourseModel(),
      location: new LocationModel(),
      term: new TermModel(),
      days: [],
      hidden: this.props.currentUser.roles().includes('admin') ? '' : 'hidden'
    };
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    const days =  [
      { value: 'monday', label: 'Monday' },
      { value: 'tuesday', label: 'Tuesday' },
      { value: 'wednesday', label: 'Wednesday' },
      { value: 'thursday', label: 'Thursday' },
      { value: 'friday', label: 'Friday' },
      { value: 'saturday', label: 'Saturday' },
      { value: 'sunday', label: 'Sunday' }
    ];
    const course = this.getCollection().get(e.currentTarget.getAttribute('data-id')) || new CourseModel();
    this.state.location.clear().set(course.get('location').attributes);
    this.state.term.clear().set(course.get('term').attributes);
    this.state.days.length = 0;
    this.state.days.push.apply(this.state.days, days.filter(day => {
      return course.get('days').includes(day.value);
    }));
    this.state.course.set(course.attributes);
    this.setState({
      showModal: true
    });
  },

  show(e) {
    e.preventDefault();
    Backbone.history.navigate('courses/' + e.currentTarget.getAttribute('data-id'), true);
  },

  render() {
    const courseItems = this.getCollection().map(function(course) {
      return (
        <Tr key={course.id}>
          <Td column="Name" value={course.get('name')}>
            <div>
              <a href="#" onClick={this.show} data-id={course.id}>{course.get('name')}</a>
              <a href="#" onClick={this.open} data-id={course.id}>
                <span className={`${this.state.hidden} pull-right`} style={{ marginLeft: '2rem' }}>
                  <FontAwesome name='pencil' />
                </span>
              </a>
            </div>
          </Td>
          <Td column="Location">{course.get('location') ? course.get('location').get('name') : ''}</Td>
          <Td column="Term">{course.get('term').get('name')}</Td>
          <Td column="Days">{course.shortDays()}</Td>
          <Td column="Seats">{course.get('registrations').length + ' / ' + course.get('seats')}</Td>
          <Td column="Cost">{'$' + Number(course.get('cost')).toFixed(2)}</Td>
        </Tr>
      );
    }, this);

    return (
      <Row>
        <Col xs={12}>
        <a href="#" className={`${this.state.hidden} pull-right`} onClick={this.open}>
          <FontAwesome name='plus' />
          &nbsp;Course
        </a>
          <Table
            className="table table-condensed table-striped"
            itemsPerPage={20}
            filterable={['Name', 'Location', 'Term', 'Days', 'Seats', 'Cost']}
            sortable={['Name', 'Location', 'Term', 'Days', 'Seats', 'Cost']}
          >
            <Thead>
              <Th>Name</Th>
              <Th>Location</Th>
              <Th>Term</Th>
              <Th>Days</Th>
              <Th>Seats</Th>
              <Th>Cost</Th>
            </Thead>
            {courseItems}
          </Table>
          <CourseModalComponent
            show={this.state.showModal}
            onHide={this.close}
            terms={this.props.terms}
            courses={this.getCollection()}
            model={this.state.course}
            term={this.state.term}
            location={this.state.location}
            days={this.state.days}
            locations={this.props.locations}
            title={'Edit Course'}/>
        </Col>
      </Row>
    );
  }
});
