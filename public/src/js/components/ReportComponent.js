var React = require('react');
require('react.backbone');
var sql = require('sql.js');
var _ = require('underscore');
var Codemirror = require('react-codemirror');
require('cm-sql');

module.exports = React.createBackboneClass({
  db: undefined,

  componentDidMount: function() {
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/report', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      var uInt8Array = new Uint8Array(this.response);
      that.db = new sql.Database(uInt8Array);
      that.getModel().set(that.db.exec(that.getModel().get('code'))[0]);
    };
    xhr.send();
  },

  updateCode: function(newCode) {
    this.getModel().set({
      code: newCode
    }, {
      silent: true
    });
  },

  executeCode: function(e) {
    try {
      this.refs.error.textContent = '';
      this.getModel().set(this.db.exec(this.getModel().get('code'))[0]);
    } catch (e) {
      this.refs.error.textContent = e;
    }
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
      <div className="row">
        <div className="col s12">
          <br />
          <Codemirror value={this.getModel().get('code')} ref="commands" options={options} onChange={this.updateCode} />
          <button onClick={this.executeCode} className="btn waves-effect waves-light">Execute<i className="material-icons right">code</i></button>
          <pre style={{color: '#a20000'}} ref="error"></pre>
          <div style={{overflowX: 'scroll'}}>
            <table>
              <thead>
                <tr>{ths}</tr>
              </thead>
              <tbody>{trs}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});
