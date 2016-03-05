var Backbone = require('backbone');
var React = require('react');
var moment = require('moment');
require('backbone-react-component');
var TermModel = require('../models/termModel');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  componentDidMount: function() {
    if (this.props.model) {
      this.refs.name.value = this.props.model.get('name');
      this.refs.start_date.value = this.props.model.get('start_date');
      this.refs.end_date.value = this.props.model.get('end_date');
    }
  },
  
  saveTerm: function(e) {
    e.preventDefault();
    var that = this;
    var term;
    if (this.props.model) {
      term = this.props.model;
    } else {
      term = new TermModel();
    }

    term.save({
      name: this.refs.name.value,
      start_date: this.refs.start_date.value,
      end_date: this.refs.end_date.value
    }, {
      success: function () {
        that.props.collection.add(term);
      }
    });
  },

  render: function() {
    var termId = '';
    if (this.props.model) {
      termId = this.props.model.id;
      Materialize.updateTextFields();
    }
    return (
      <div id={'term-modal' + termId} className="modal">
        <div className="modal-content">
          <div className="row">
            <form className="col s12" onSubmit={this.saveTerm}>
              <div className="row">
                <div className="input-field col s12">
                  <input ref="name" type="text" id="name" />
                  <label htmlFor="name">Name</label>
                </div>
              </div>
              <div className="row">
                <div className="col s6">
                  <label htmlFor="start-date">Start Date</label>
                  <input ref="start_date" type="date" name="start_date" id="start-date" className="datepicker" />
                </div>
                <div className="col s6">
                  <label htmlFor="end-date">End Date</label>
                  <input ref="end_date" type="date" name="end_date" id="end-date" className="datepicker" />
                </div>
              </div>
              <input type="submit" className="modal-action modal-close waves-effect waves-green btn-flat" value="Submit"/>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
