var Backbone = require('backbone');
var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
require('backbone-react-component');
var moment = require('moment');

module.exports = React.createClass({
  pickadate: undefined,
  
  mixins: [Backbone.React.Component.mixin],
  
  componentDidMount: function() {
    this.pickadate = $('input[type="date"]').pickadate().pickadate('picker');
    this.pickadate.set('select', new Date().getTime(), { muted: true });
    $('input[type="time"]').pickatime();
  },
  
  checkinUser: function(e) {
    e.preventDefault();
    var time = this.refs.time.value ? moment(this.refs.time.value, 'hh:mm a').format('HH:mm') : moment().format('HH:mm')
    var dateTime = moment(this.refs.date.value, 'D MMMM, YYYY').format('YYYY-MM-DD') + ' ' + time;
    var user = this.props.users.findWhere({ 'idn': parseInt(this.refs.idn.value) });
    if (!user) {
      Materialize.toast('User with IDN of ' + this.refs.idn.value + ' does not exist!', 4000, 'red darken-1');
    } else {
      if (!_.some(user.get('attendance'), function(date) { return moment(date).isSame(dateTime, 'day')})) {
        user.get('attendance').push(dateTime);
        user.save();
      }
      this.props.model.set(user.attributes);
    }
    this.refs.idn.value = '';
    this.pickadate.set('select', new Date().getTime(), { muted: true });
    this.refs.time.value = '';
    this.refs.idn.focus();
  },
  
  render: function() {
    return (
      <div>
        <br/>
        <form className="col s12" onSubmit={this.checkinUser}>
          <div className="row">
            <div className="col m4 s12">
              <label>IDN</label>
              <input type="text" ref="idn" />
            </div>
            <div className="col m4 s12">
              <label htmlFor="start-date">Date</label>
              <input ref="date" type="date" />
            </div>
            <div className="col m4 s12">
              <label htmlFor="start-date">Time (leave blank for current time)</label>
              <input ref="time" type="time" />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <button className="btn waves-effect waves-light" type="submit" name="action">Check In
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col s12 m6">
            <div className="card">
              <div className="card-content">
                <span className="card-title">{this.props.model.get('first_name') + ' ' + this.props.model.get('last_name')}</span>
                <p><i className="fa fa-fw fa-envelope"></i> {this.props.model.get('username')}</p>
                <p><i className="fa fa-fw fa-mobile"></i> {this.props.model.get('phone')}</p>
                <p><i className="fa fa-fw fa-github"></i> {this.props.model.get('github')}</p>
                <p><i className="fa fa-fw fa-globe"></i> {this.props.model.get('website')}</p>
              </div>
              <div className="card-action">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
