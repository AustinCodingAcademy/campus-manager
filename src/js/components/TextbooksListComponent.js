import * as React from 'react';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { Col, Row, Button, FormControl } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import TextbookModalComponent from './TextbookModalComponent';
import TextbookModel from '../models/TextbookModel';

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      showModal: false,
      textbook: new TextbookModel(),
      modalTitle: 'New Textbook',
      filterBy: ''
    }
  },

  close() {
    this.setState({ showModal: false });
  },

  open(e) {
    e.preventDefault();
    const textbook = this.getCollection().get(e.currentTarget.getAttribute('data-id')) || new TextbookModel();
    this.state.textbook.clear().set(textbook.attributes);
    this.setState({
      showModal: true,
      modalTitle: textbook.id ? 'Edit Textbook' : 'New Textbook'
    });
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  render() {
    const textbookRows = this.getCollection().map(textbook => {
      return (
        <Tr key={textbook.id}>
          <Td column="Name">{textbook.get('name')}</Td>
          <Td column="Instructor URL" value={textbook.get('instructor_url')}>
            <a
              href={textbook.get('instructor_url')}
              target="_blank"
            >
              {textbook.get('instructor_url')}
            </a>
          </Td>
          <Td column="Student URL" value={textbook.get('student_url')}>
            <a
              href={textbook.get('student_url')}
              target="_blank"
            >
              {textbook.get('student_url')}
            </a>
          </Td>
          <Td column="edit">
            <a href="#" onClick={this.open} data-id={textbook.id}>
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
            Textbooks
            <small>
              <a href="#" className="pull-right" onClick={this.open} data-test="new-textbook">
                <FontAwesome name='plus' />
                &nbsp;Textbook
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
              filterable={['Name', 'Instructor URL', 'Student URL']}
              sortable={['Name']}
              filterBy={this.state.filterBy}
            >
              <Thead>
                <Th>Name</Th>
                <Th>Instructor URL</Th>
                <Th>Student URL</Th>
                <Th>edit</Th>
              </Thead>
              {textbookRows}
            </Table>
          </div>
          <TextbookModalComponent
            show={this.state.showModal}
            onHide={this.close}
            textbooks={this.getCollection()}
            model={this.state.textbook}
            title={this.state.modalTitle}
            listComponent={this}
          />
        </Col>
      </Row>
    );
  }
});
