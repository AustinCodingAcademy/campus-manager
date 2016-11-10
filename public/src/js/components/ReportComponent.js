var React = require('react');
require('react.backbone');
var _ = require('underscore');
var Codemirror = require('react-codemirror');
require('cm-sql');
var work = require('webworkify');
var worker = work(require('worker.sql.js'));
var tableToCsv = require('node-table-to-csv');

module.exports = React.createBackboneClass({
  componentDidMount: function() {
    this.loadDatabase();
  },

  _loadPayments: function() {
    this.loadDatabase(true);
  },

  loadDatabase: function(payments) {
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/report?payments=' + payments, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      worker.onmessage = function() {
        URL.revokeObjectURL(worker.objectURL);
        $('.database-toast').fadeOut();
        worker.onmessage = function(event){
          $('.database-query').fadeOut();
          that.getModel().set(event.data.results[0]); // The result of the query
        };
        that.executeCode();
      }
      worker.onerror = function(e) {
        $('.database-query').fadeOut();
        that.refs.error.textContent = e.message
       };
      worker.postMessage({
        id: 1,
        action: 'open',
        buffer: new Uint8Array(this.response),
      });
    };
    xhr.send();
    Materialize.toast($('<span>Loading Database <i class="fa fa-cog fa-spin fa-fw"></i><span>'), null, 'database-toast');
  },

  updateCode: function(newCode) {
    this.getModel().set({
      code: newCode
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
    worker.postMessage({
      id: 2,
      action: 'exec',
      sql: this.getModel().get('code')
    });
  },

  render: function() {
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

    return (
      <div>
        <br />
        <div className="row">
          <div className="col s12">
            <Codemirror value={this.getModel().get('code')} ref="commands" options={options} onChange={this.updateCode} />
          </div>
        </div>
        <div className="row">
          <div className="col s12 m4">
            <a onClick={this._handleSubmit} className="btn waves-effect waves-light">Execute<i className="material-icons right">code</i></a>
          </div>
          <div className="col s12 m3">
            <a onClick={this._exportCSV} className="btn waves-effect waves-light">CSV <i className="material-icons right">file_download</i></a>
          </div>
          <div className="col s12 m5">
            <a onClick={this._loadPayments} className="btn waves-effect waves-light">Load Payments <i className="material-icons right">attach_money</i></a>
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
