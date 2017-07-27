import * as React from 'react';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { Col, Row, Button, FormControl } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const TrackModalComponent = require('./TrackModalComponent');
const TrackModel = require('../models/TrackModel');
import { Sparklines, SparklinesLine } from 'react-sparklines';

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      track: new TrackModel(),
      modalTitle: 'New Track',
      filterBy: ''
    }
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    const track = this.getCollection().get(e.currentTarget.getAttribute('data-id')) || new TrackModel();
    this.state.track.clear().set(track.attributes);
    this.setState({
      showModal: true,
      modalTitle: track.id ? 'Edit Track' : 'New Track'
    });
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  render() {
    const trackRows = this.getCollection().map(track => {
      const enrollments = [];
      track.get('courses').comparator = track.get('courses').reverse;
      track.get('courses').sort();
      const courses = track.get('courses').map((course, idx) => {
        enrollments.push(course.get('registrations').length);
        return (<div key={`${track.id}-${course.id}`}>{idx + 1}. {course.get('term').get('name')} - {course.get('name')} - Section {course.get('section')} - {course.properDays()}</div>);
      });
      return (
        <Tr key={track.id}>
          <Td column="Name">{track.get('name')}</Td>
          <Td column="Courses"><div>{courses}</div></Td>
          <Td column="Enrollment">
            <Sparklines data={enrollments} width={100} height={20} margin={5}><SparklinesLine /></Sparklines>
          </Td>
          <Td column="edit">
            <a href="#" onClick={this.open} data-id={track.id}>
              <FontAwesome name='pencil' />
            </a>
          </Td>
        </Tr>
      );
    });
    return (
      <Row>
        <Col xs={12}>
          <h3>
            Tracks
            <small>
              <a href="#" className="pull-right" onClick={this.open} data-test="new-track">
                <FontAwesome name='plus' />
                &nbsp;Track
              </a>
            </small>
          </h3>
          <FormControl
            type="text"
            placeholder="Filter..."
            onChange={this.changeFilterValue}
            defaultValue={this.state.filterBy}
          />
          <br />
          <div className="x-scroll">
            <Table
              className="table table-condensed table-striped"
              itemsPerPage={20}
              filterable={['Name', 'Courses']}
              sortable={['Name', 'Courses']}
              filterBy={this.state.filterBy}
            >
              <Thead>
                <Th>Name</Th>
                <Th>Courses</Th>
                <Th>Enrollment</Th>
                <Th>edit</Th>
              </Thead>
              {trackRows}
            </Table>
          </div>
          <TrackModalComponent
            show={this.state.showModal}
            onHide={this.close}
            tracks={this.getCollection()}
            model={this.state.track}
            title={this.state.modalTitle}
            listComponent={this}
            courses={this.props.courses}
          />
        </Col>
      </Row>
    );
  }
});
