var _ = require('underscore');
var React = require('react');
require('react.backbone');
var CourseModel = require('../models/CourseModel');

module.exports = React.createBackboneClass({
  days: [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ],

  componentDidMount: function() {
    var that = this;
    this.refs.name.value = this.getModel().get('name');
    this.refs.seats.value = this.getModel().get('seats');
    _.each(this.days, function(day) {
      that.refs[day].checked = _.indexOf(that.getModel().get('days'), day) > -1;
    });
    this.refs.term.value = this.getModel().get('term').id;
    this.refs.textbook.value = this.getModel().get('textbook');
    this.refs.holidays.value = this.getModel().get('holidays').join(', ');
    this.refs.cost.value = Number(this.getModel().get('cost')).toFixed(2);

    $('select').material_select();
    Materialize.updateTextFields();
    $('.modal').modal();
  },

  saveCourse: function(e) {
    e.preventDefault();
    var that = this;
    this.getModel().save({
      name: this.refs.name.value,
      textbook: this.refs.textbook.value,
      days: _.filter(this.days, function(day) { return that.refs[day].checked; }),
      seats: this.refs.seats.value,
      term: this.props.terms.get(this.refs.term.value),
      holidays: _.map(this.refs.holidays.value.split(','), function(holiday) { return holiday.trim(); }),
      cost: Number(this.refs.cost.value)
    }, {
      success: function() {
        that.getCollection().add(that.getModel());
      }
    });

  },

  render: function() {
    var termOptions = [];
    this.props.terms.each(function(term) {
      termOptions.push(<option key={term.id} value={term.id}>{term.get('name')}</option>);
    });

    return (
      <div id={'course-modal' + (this.getModel().id ? this.getModel().id  : '')} className="modal">
        <div className="modal-content">
          <div className="row">
            <form className="col s12" onSubmit={this.saveCourse}>
              <div className="row">
                <div className="input-field col s12 m6">
                  <input ref="name" type="text" id="name" />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="input-field col s6 m3">
                  <input ref="cost" type="text" id="cost" />
                  <label htmlFor="cost">Cost</label>
                </div>
                <div className="input-field col s6 m3">
                  <label htmlFor="seats">Seats</label>
                  <input ref="seats" type="text" name="seats" id="seats" />
                </div>
              </div>
              <div className="row">
                <div className="col s6 m3">
                  <input ref="monday" type="checkbox" id="monday" />
                  <label htmlFor="monday">Mon</label>
                </div>
                <div className="col s6 m3">
                  <input ref="tuesday" type="checkbox" id="tuesday" />
                  <label htmlFor="tuesday">Tues</label>
                </div>
                <div className="col s6 m3">
                  <input type="checkbox" id="wednesday" name="days" ref="wednesday" />
                  <label htmlFor="wednesday">Wed</label>
                </div>
                <div className="col s6 m3">
                  <input type="checkbox" id="thursday" name="days" ref="thursday" />
                  <label htmlFor="thursday">Thur</label>
                </div>
              </div>
              <div className="row">
                <div className="col s6 m3">
                  <input type="checkbox" id="friday" name="days" ref="friday" />
                  <label htmlFor="friday">Fri</label>
                </div>
                <div className="col s6 m3">
                  <input type="checkbox" id="saturday" name="days" ref="saturday" />
                  <label htmlFor="saturday">Sat</label>
                </div>
                <div className="col s6 m3">
                  <input type="checkbox" id="sunday" name="days" ref="sunday" />
                  <label htmlFor="sunday">Sun</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 m6">
                  <select defaultValue={this.props.terms.first().id} ref="term">
                    {termOptions}
                  </select>
                  <label>Term</label>
                </div>
                <div className="input-field col s12 m6">
                  <input ref="textbook" type="text" id="textbook" />
                  <label htmlFor="textbook">Textbook URL</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input ref="holidays" type="text" id="holidays" placeholder="YYYY-MM-DD, YYYY-MM-DD, etc"/>
                  <label htmlFor="holidays">Holidays</label>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <input type="submit" className="modal-action modal-close waves-effect waves-green btn" value="Submit"/>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
