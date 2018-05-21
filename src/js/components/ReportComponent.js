import * as Backbone from 'backbone';
import * as React from 'react';
import CodeMirror from 'react-codemirror';
import 'cm-sql';
import Clipboard from 'clipboard';
import utils from '../utils';
import { Table } from 'reactable';
import {
  Col, Row, Button, FormControl, ButtonGroup, OverlayTrigger, Tooltip, Tabs,
  Tab, DropdownButton, MenuItem
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

module.exports = React.createBackboneClass({
  mixins: [
    React.BackboneMixin("browse")
  ],

  getInitialState() {
    return {
      consoleClass: '',
      consoleText: '',
      filterBy: '',
      filterBrowseBy: '',
      browseTable: 'Select...',
      tables: []
    };
  },

  componentDidMount() {
    var clipboard = new Clipboard('[data-clipboard-text]');
    this.executeCode(null, null, null, this.getModel());
    this.executeCode(null, null, null, this.props.browse);
  },

  changeFilterValue(e) {
    this.setState({
      filterBy: e.currentTarget.value
    });
  },

  changeFilterBrowseValue(e) {
    this.setState({
      filterBrowseBy: e.currentTarget.value
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

  refresh: function() {
    this.executeCode(null, null, null, this.getModel(), true);
    this.executeCode(null, null, null, this.props.browse, true);
  },

  executeCode: function(a, b, c, model, refresh) {
    model = model || this.getModel();
    this.setState({
      consoleClass: '',
      consoleText: `Executing query...`
    });
    model.url = model.link(this.url, 'json');
    model.fetch({
      global: false,
      data: {
        refresh: refresh
      },
      success: () => {
        this.setState({
          consoleClass: '',
          consoleText: `${model.get('results').length} results returned.`
        });
        if (model.get('browse') && !this.state.tables.length) {
          Array.prototype.push.apply(this.state.tables, model.get('results').map((result) => {
            return result.name;
          }));
        }

      },
      error: (response, err) => {
        this.setState({
          consoleClass: 'text-danger',
          consoleText: err.responseJSON.message
        });
      }
    });
  },

  selectBrowse(table) {
    this.setState({browseTable: table});
    this.props.browse.set('hash', btoa(`select * from ${table};`));
    this.executeCode(null, null, null, this.props.browse);
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
    const tables = this.state.tables.map(table => {
      return (
        <MenuItem eventKey={table}>{table}</MenuItem>
      );
    });

    return (
      <Tabs defaultActiveKey={1} animation={false} id="report-tabs">
        <Tab eventKey={1} title="Report Builder">
          <br />
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
                <Button onClick={this.refresh}>
                  <FontAwesome name="refresh" />
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
                  sortable={this.getModel().get('columnHeaders')}
                />
              </div>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title="Browse Tables">
          <br />
          <DropdownButton bsStyle={'primary'} title={this.state.browseTable} onSelect={this.selectBrowse} id="browse-select">
            {tables}
          </DropdownButton>
          <br />
          <br />
          <pre className={this.state.consoleClass}>{this.state.consoleText}</pre>
          <br />
          <FormControl
            type="text"
            placeholder="Filter..."
            onChange={this.changeFilterBrowseValue}
            defaultValue={this.state.filterBrowseBy}
          />
          <br/>
          <div className="x-scroll">
            <Table
              className="table table-condensed table-striped"
              itemsPerPage={20}
              data={this.props.browse.get('results')}
              filterable={this.props.browse.get('results').length ? Object.keys(this.props.browse.get('results')[0]) : []}
              filterBy={this.state.filterBrowseBy}
              sortable={this.props.browse.get('columnHeaders')}
            />
          </div>
        </Tab>
      </Tabs>
    );
  }
});
