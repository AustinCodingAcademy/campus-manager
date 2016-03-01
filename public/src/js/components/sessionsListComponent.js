var Backbone = require('backbone');
var React = require('react');
require('backbone-react-component');
var SessionItemComponent = require('./sessionItemComponent.js');
var SessionModel = require('../models/sessionModel');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  componentDidMount: function() {
    $('[href="#new-site-modal"]').leanModal();
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
      container: 'body',
      klass: {
        picker: 'picker z-top'
      }
    });
  },
  
  newSession: function(e) {
    e.preventDefault();
    var that = this;
    var session = new SessionModel();
    
    session.save({
      name: this.refs.name.value,
      start_date: this.refs.start_date.value,
      end_date: this.refs.end_date.value
    }, {
      success: function () {
        that.props.collection.add(session);
      }
    });
  },
  
  render: function() {
    var sessionItems = this.props.collection.map(function(sessionItem) {
      return <SessionItemComponent  key={sessionItem.id} model={sessionItem} />
    });
    
    return (
      <div className="row">
        <div className="col s12">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessionItems}
            </tbody>
          </table>
          <a className="waves-effect waves-teal btn modal-trigger" href="#new-site-modal"><i className="material-icons left">add</i> session</a>
          <div id="new-site-modal" className="modal">
            <div className="modal-content">
              <div className="row">
                <form className="col s12" onSubmit={this.newSession}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input ref="name" type="text" id="name" />
                      <label htmlFor="name">Name</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s6">
                      <input ref="start_date" type="date" name="start_date" id="start-date" className="datepicker" />
                      <label htmlFor="start-date">Start Date</label>
                    </div>
                    <div className="input-field col s6">
                      <input ref="end_date" type="date" name="end_date" id="end-date" className="datepicker" />
                      <label htmlFor="end-date">End Date</label>
                    </div>
                  </div>
                  <input type="submit" className="modal-action modal-close waves-effect waves-green btn-flat" value="Submit"/>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
