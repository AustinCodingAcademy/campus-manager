import * as Backbone from 'backbone';
import * as React from 'react';
import 'react.backbone';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { Col, Row, Button, FormControl } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const LocationModalComponent = require('./LocationModalComponent');
const LocationModel = require('../models/LocationModel');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      location: new LocationModel(),
      modalTitle: 'New Location',
      filterBy: ''
    }
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    const location = this.getCollection().get(e.currentTarget.getAttribute('data-id')) || new LocationModel();
    this.state.location.clear().set(location.attributes);
    this.setState({
      showModal: true,
      modalTitle: location.id ? 'Edit Location' : 'New Location'
    });
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  render() {
    const locationRows = this.getCollection().map(location => {
      return (
        <Tr key={location.id}>
          <Td column="Name">{location.get('name')}</Td>
          <Td column="Address" value={`${location.get('address')} ${location.get('city')} ${location.get('state')} ${location.get('zipcode')}`}>
            <a
              href={`https://www.google.com/maps/search/${location.get('name')} ${location.get('address')} ${location.get('city')} ${location.get('state')} ${location.get('zipcode')}`.split(' ').join('+')}
              target="_blank"
            >
              {`${location.get('address')}, ${location.get('city')}, ${location.get('state')} ${location.get('zipcode')}`}
            </a>
          </Td>
          <Td column="Phone">{location.get('phone')}</Td>
          <Td column="Contact">{location.get('contact')}</Td>
          <Td column="Note">{location.get('note')}</Td>
          <Td column="edit">
            <a href="#" onClick={this.open} data-id={location.id}>
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
            Locations
            <small>
              <a href="#" className="pull-right" onClick={this.open}>
                <FontAwesome name='plus' />
                &nbsp;Location
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
              filterable={['Name', 'Address', 'Phone', 'Contact', 'Note']}
              sortable={['Name']}
              filterBy={this.state.filterBy}
            >
              <Thead>
                <Th>Name</Th>
                <Th>Address</Th>
                <Th>Phone</Th>
                <Th>Contact</Th>
                <Th>Note</Th>
                <Th>edit</Th>
              </Thead>
              {locationRows}
            </Table>
          </div>
          <LocationModalComponent
            show={this.state.showModal}
            onHide={this.close}
            locations={this.getCollection()}
            model={this.state.location}
            title={this.state.modalTitle}
          />
        </Col>
      </Row>
    );
  }
});
