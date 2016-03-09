var Backbone = require('backbone');
var React = require('react');
var moment = require('moment');
require('backbone-react-component');
var TermModel = require('../models/termModel');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  componentDidMount: function() {
    this.refs.name.value = this.props.model.get('name');
    this.refs.start_date.value = this.props.model.get('start_date');
    this.refs.end_date.value = this.props.model.get('end_date');
    
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
      container: 'body',
      klass: {
        picker: 'picker z-top'
      }
    });
  },
  
  saveTerm: function(e) {
    e.preventDefault();
    var that = this;

    this.props.model.save({
      name: this.refs.name.value,
      start_date: this.refs.start_date.value,
      end_date: this.refs.end_date.value
    }, {
      success: function (term) {
        that.props.collection.add(term);
      }
    });
  },

  render: function() {
    return (
      <div id={'term-modal' + (this.props.model.id ? this.props.model.id  : '')} className="modal">
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
