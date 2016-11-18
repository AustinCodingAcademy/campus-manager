var Backbone = require('backbone');
var React = require('react');
require('react.backbone');
var _ = require('underscore');
var Codemirror = require('react-codemirror');
require('cm-sql');
var work = require('webworkify');
var tableToCsv = require('node-table-to-csv');
var Clipboard = require('clipboard');
var utils = require('../utils');

module.exports = React.createBackboneClass({
  worker: undefined,

  componentDidMount: function() {
    this.worker = work(require('worker.sql.js'));
    this.loadDatabase();
    var clipboard = new Clipboard('[data-clipboard-text]');
    clipboard.on('success', function(e) {
      Materialize.toast('Link copied!', 3000);
      e.clearSelection();
    });
  },

  loadDatabase: function() {
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/report', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      that.worker.onmessage = function() {
        URL.revokeObjectURL(that.worker.objectURL);
        $('.database-toast').fadeOut();
        that.worker.onmessage = function(event){
          $('.database-query').fadeOut();
          that.getModel().set(event.data.results[0] || {columns: [], values: []}); // The result of the query
        };
        that.executeCode();
      }
      that.worker.onerror = function(e) {
        $('.database-query').fadeOut();
        that.refs.error.textContent = e.message
       };
      that.worker.postMessage({
        id: 1,
        action: 'open',
        buffer: new Uint8Array(this.response),
      });
    };
    xhr.send();
    Materialize.toast($('<span>Loading Database <i class="fa fa-cog fa-spin fa-fw"></i><span>'), null, 'database-toast');
  },

  updateCode: function(sql) {
    this.getModel().set({
      sql: sql
    }, {
      silent: true
    });
  },

  _exportCSV: function() {
    var csv = tableToCsv('<table>' + this.refs.report.innerHTML + '</table>');
    var uri = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = "report.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  },

  _handleSubmit: function(e) {
    try {
      this.refs.error.textContent = '';
      this.executeCode();
    } catch (e) {
      this.refs.error.textContent = e;
    }
  },

  executeCode: function() {
    Materialize.toast($('<span>Executing Query <i class="fa fa-cog fa-spin fa-fw"></i><span>'), null, 'database-query');
    this.worker.postMessage({
      id: 2,
      action: 'exec',
      sql: this.getModel().get('sql')
    });
  },

  render: function() {
    Backbone.history.navigate('#report/' + btoa(this.getModel().get('sql')));
    var ths = _.map(this.getModel().get('columns'), function(column) {
      return <th key={column}>{column}</th>
    });

    var trs = _.map(this.getModel().get('values'), function(row) {
      var tds = _.map(row, function(datum, idx) {
        return <td key={datum + idx}>{datum}</td>;
      })
      return <tr key={row.join('')}>{tds}</tr>;
    });

    var options = {
      mode: 'text/x-mysql',
      viewportMargin: Infinity,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets : true,
      autofocus: true
    };

    var url = utils.urlParse(window.location);

    return (
      <div>
        <br />
        <div className="row">
          <div className="col s12">
            <strong>Copy: </strong>
            <a data-clipboard-text={window.location.href} href="#" onClick={function(e) { e.preventDefault(); }}>Shareable Link</a> |&nbsp;
            <a data-clipboard-text={url.host + '/api/' + url.hash.slice(1, -1) + '?format=html'} href="#" onClick={function(e) { e.preventDefault(); }}>API (HTML)</a> |&nbsp;
            <a data-clipboard-text={url.host + '/api/' + url.hash.slice(1, -1) + '?format=csv'} href="#" onClick={function(e) { e.preventDefault(); }}>API (CSV)</a> |&nbsp;
            <a data-clipboard-text={url.host + '/api/' + url.hash.slice(1, -1) + '?format=json'} href="#" onClick={function(e) { e.preventDefault(); }}>API (JSON)</a>
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
            <a onClick={this._handleSubmit} className="btn waves-effect waves-light">Execute<i className="material-icons right">code</i></a>
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
              <table ref="report" className="striped">
                <thead>
                  <tr>{ths}</tr>
                </thead>
                <tbody>{trs}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
