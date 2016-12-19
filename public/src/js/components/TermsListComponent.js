import * as React from 'react';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { Col, Row, Button, FormControl } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const TermModalComponent = require('./TermModalComponent.js');
const TermModel = require('../models/TermModel');
const moment = require('moment');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      term: new TermModel(),
      modalTitle: 'New Term',
      filterBy: ''
    }
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    const term = this.getCollection().get(e.currentTarget.getAttribute('data-id')) || new TermModel();
    this.state.term.clear().set(term.attributes);
    this.setState({
      showModal: true,
      modalTitle: term.id ? 'Edit Term' : 'New Term'
    });
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  render: function() {
    const termRows = this.getCollection().map(term => {
      return (
        <Tr key={term.id}>
          <Td column="Name">{term.get('name')}</Td>
          <Td
            column="Dates"
            value={`${moment.utc(term.get('start_date')).format('ddd, MMM D, YYYY')} ${moment.utc(term.get('end_date')).format('ddd, MMM D, YYYY')}`}
          >
            {`${moment.utc(term.get('start_date')).format('ddd, MMM D, YYYY')} - ${moment.utc(term.get('end_date')).format('ddd, MMM D, YYYY')}`}
          </Td>
          <Td column="edit">
            <a href="#" onClick={this.open} data-id={term.id}>
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
            Terms
            <small>
              <a href="#" className="pull-right" onClick={this.open}>
                <FontAwesome name='plus' />
                &nbsp;Term
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
              filterable={['Name', 'Dates']}
              sortable={['Name', 'Dates']}
              filterBy={this.state.filterBy}
            >
              <Thead>
                <Th>Name</Th>
                <Th>Dates</Th>
                <Th>edit</Th>
              </Thead>
              {termRows}
            </Table>
          </div>
          <TermModalComponent
            show={this.state.showModal}
            onHide={this.close}
            terms={this.getCollection()}
            model={this.state.term}
            title={this.state.modalTitle}
          />
        </Col>
      </Row>
    );
  }
});
