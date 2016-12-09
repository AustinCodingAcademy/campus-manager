var Backbone = require('backbone');
var React = require('react');
require('react.backbone');
var _ = require('underscore');
var Codemirror = require('react-codemirror');
require('cm-sql');
var tableToCsv = require('node-table-to-csv');
var Clipboard = require('clipboard');
var utils = require('../utils');
var Table = require('reactable').Table;

module.exports = React.createBackboneClass({
  componentDidMount: function() {
    var clipboard = new Clipboard('[data-clipboard-text]');
    clipboard.on('success', function(e) {
      Materialize.toast('Link copied!', 3000);
      e.clearSelection();
    });
    this._executeCode();
  },

  updateAddress: function() {
    Backbone.history.navigate('#report/' + btoa(this.getModel().get('sql')));
    this.url = utils.urlParse(window.location);
  },

  updateCode: function(sql) {
    this.getModel().set({
      sql: sql
    }, {
      silent: true
    });
    this.updateAddress();
  },

  _exportCSV: function() {
    window.location = this.getModel().link(this.url, 'csv');
  },

  _executeCode: function() {
    var that = this;
    this.refs.error.textContent = '';
    Materialize.toast($('<span>Executing Query <i class="fa fa-cog fa-spin fa-fw"></i><span>'), null, 'database-query');
    this.getModel().url = this.getModel().link(this.url, 'json');
    this.getModel().fetch({
      data: {timestamp: that.getModel().get('timestamp')},
      global: false,
      success: function(response) {
        $('.database-query').fadeOut();
      },
      error: function(response, err) {
        $('.database-query').fadeOut();
        that.refs.error.textContent = err.responseJSON.message;
      }
    })
  },

  render: function() {
    this.updateAddress();

    var options = {
      mode: 'text/x-mysql',
      viewportMargin: Infinity,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets : true,
      autofocus: true
    };

    return (
      <div>
        <br />
        <div className="row">
          <div className="col s12">
            <strong>Copy: </strong>
            <a data-clipboard-text={window.location.href} href="#" onClick={function(e) { e.preventDefault(); }}>Shareable Link</a> |&nbsp;
            <a data-clipboard-text={this.getModel().link(this.url, 'html', this.props.currentUser.get('api_key'))} href="#" onClick={function(e) { e.preventDefault(); }}>API (HTML)</a> |&nbsp;
            <a data-clipboard-text={this.getModel().link(this.url, 'csv', this.props.currentUser.get('api_key'))} href="#" onClick={function(e) { e.preventDefault(); }}>API (CSV)</a> |&nbsp;
            <a data-clipboard-text={this.getModel().link(this.url, 'json', this.props.currentUser.get('api_key'))} href="#" onClick={function(e) { e.preventDefault(); }}>API (JSON)</a>
            <br />
            <small>
              To use the API links, you must generate an API token on your dashboard.
              <br />
              These links are not meant to be shared with anyone, but are used for API services.
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <Codemirror value={this.getModel().get('sql')} ref="commands" options={options} onChange={this.updateCode} />
          </div>
        </div>
        <div className="row">
          <div className="col s6">
            <a onClick={this._executeCode} className="btn waves-effect waves-light">Execute<i className="material-icons right">code</i></a>
          </div>
          <div className="col s6">
            <a onClick={this._exportCSV} className="btn waves-effect waves-light right">CSV <i className="material-icons right">file_download</i></a>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <pre style={{color: '#a20000'}} ref="error"></pre>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <div style={{overflowX: 'scroll'}}>
              <Table className="striped" data={this.getModel().get('results')} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
