import * as Backbone from 'backbone';
import * as React from 'react';
const CodeMirror = require('react-codemirror');
import 'cm-sql';
const Clipboard = require('clipboard');
const utils = require('../utils');
import { Table } from 'reactable';
import {
  Col, Row, Button, FormControl, ButtonGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      consoleClass: '',
      consoleText: '',
      filterBy: ''
    };
  },

  componentDidMount() {
    var clipboard = new Clipboard('[data-clipboard-text]');
    this.executeCode();
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  updateAddress() {
    Backbone.history.navigate('#report/' + btoa(this.getModel().get('sql')));
    this.url = utils.urlParse(window.location);
  },

  updateCode(sql) {
    this.getModel().set({
      sql: sql
    }, {
      silent: true
    });
    this.updateAddress();
  },

  exportCSV() {
    window.location = this.getModel().link(this.url, 'csv');
  },

  executeCode: function() {
    this.setState({
      consoleClass: '',
      consoleText: `Executing query...`
    });
    this.getModel().url = this.getModel().link(this.url, 'json');
    this.getModel().fetch({
      data: { timestamp: this.getModel().get('timestamp') },
      global: false,
      success: () => {
        this.setState({
          consoleClass: '',
          consoleText: `${this.getModel().get('results').length} results returned.`
        });
      },
      error: (response, err) => {
        this.setState({
          consoleClass: 'text-danger',
          consoleText: err.responseJSON.message
        });
      }
    })
  },

  render: function() {
    this.updateAddress();

    const options = {
      mode: 'text/x-mysql',
      viewportMargin: Infinity,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets : true,
      autofocus: true
    };

    const tooltip = <Tooltip id="tooltip">Copied!</Tooltip>;

    return (
      <div>
        <Row>
          <Col xs={12}>
            <strong>Copy: </strong>
            <OverlayTrigger
              placement="top"
              overlay={tooltip}
              trigger={['focus']}
            >
              <a
                data-clipboard-text={window.location.href}
                href="#"
                onClick={function(e) { e.preventDefault(); }}
              >
                  Shareable Link
              </a>
            </OverlayTrigger>
            &nbsp;|&nbsp;
            <OverlayTrigger
              placement="top"
              overlay={tooltip}
              trigger={['focus']}
            >
              <a
                data-clipboard-text={this.getModel().link(this.url, 'html', this.props.currentUser.get('api_key'))}
                href="#"
                onClick={function(e) { e.preventDefault(); }}
              >
                API (HTML)
              </a>
            </OverlayTrigger>
            &nbsp;|&nbsp;
            <OverlayTrigger
              placement="top"
              overlay={tooltip}
              trigger={['focus']}
            >
              <a
                data-clipboard-text={this.getModel().link(this.url, 'csv', this.props.currentUser.get('api_key'))}
                href="#"
                onClick={function(e) { e.preventDefault(); }}
              >
                API (CSV)
              </a>
            </OverlayTrigger>
            &nbsp;|&nbsp;
            <OverlayTrigger
              placement="top"
              overlay={tooltip}
              trigger={['focus']}
            >
              <a
                data-clipboard-text={this.getModel().link(this.url, 'json', this.props.currentUser.get('api_key'))}
                href="#"
                onClick={function(e) { e.preventDefault(); }}
              >
                API (JSON)
              </a>
            </OverlayTrigger>
            <br />
            <small>
              To use the API links, you must generate an API token on your dashboard.
              <br />
              API links are not meant to be shared with anyone, but are used for API services.
            </small>
            <br />
            <CodeMirror value={this.getModel().get('sql')} options={options} onChange={this.updateCode} />
            <br />
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.executeCode}>
                <FontAwesome name="play" />
                &nbsp; Execute
              </Button>
              <Button onClick={this.exportCSV}>
                <FontAwesome name="download" />
                &nbsp; CSV
              </Button>
            </ButtonGroup>
            <br />
            <br />
            <pre className={this.state.consoleClass}>{this.state.consoleText}</pre>
            <br />
            <FormControl
              type="text"
              placeholder="Filter..."
              onChange={this.changeFilterValue}
              defaultValue={this.state.filterBy}
            />
            <br/>
            <div className="x-scroll">
              <Table
                className="table table-condensed table-striped"
                itemsPerPage={20}
                data={this.getModel().get('results')}
                filterable={this.getModel().get('results').length ? Object.keys(this.getModel().get('results')[0]) : []}
                filterBy={this.state.filterBy}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
});
