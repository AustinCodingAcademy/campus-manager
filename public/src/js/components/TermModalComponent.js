var React = require('react');
require('react.backbone');
var TermModel = require('../models/TermModel');
var moment = require('moment');

module.exports = React.createBackboneClass({
  componentDidMount: function() {
    this.refs.name.value = this.getModel().get('name');
    $(this.refs.start_date).pickadate().pickadate('picker').set('select', moment.utc(this.getModel().get('start_date')).format('D MMMM, YYYY'), { muted: true });
    $(this.refs.end_date).pickadate().pickadate('picker').set('select', moment.utc(this.getModel().get('end_date')).format('D MMMM, YYYY'), { muted: true });
    $(document).ready(function() {
      $('select').material_select();
    });
  },

  saveTerm: function(e) {
    e.preventDefault();
    var that = this;

    this.getModel().save({
      name: this.refs.name.value,
      start_date: this.refs.start_date.value,
      end_date: this.refs.end_date.value,
      location: this.props.locations.get(this.refs.location.value),
    }, {
      success: function (term) {
        that.getCollection().add(term);
      }
    });
  },

  deleteTerm: function(e) {
    e.preventDefault();
    var r = confirm('Are you sure you want to delete this term?');
    if (r == true) {
      this.getModel().destroy({
        wait: true,
        success: function() {
          $('#term-modal').closeModal();
        }
      });
    }
  },

  render: function() {

    var locationOptions = [];
    this.props.locations.each(function(location) {
      locationOptions.push(<option key={location.id} value={location.id}>{location.get('name')}</option>);
    });

    return (
      <div id={'term-modal' + (this.getModel().id ? this.getModel().id  : '')} className="modal">
        <div className="modal-content">
          <div className="row">
            <form className="col s12" onSubmit={this.saveTerm}>
              <div className="row">
                <div className="input-field col s12 m6">
                  <input ref="name" type="text" />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="input-field col s12 m6">
                  <select defaultValue={this.getModel().get('location') ? this.getModel().get('location').id : this.props.locations.first().id} ref="location" id="location">
                    {locationOptions}
                  </select>
                  <label htmlFor="location">Location</label>
                </div>
              </div>
              <div className="row">
                <div className="col s6">
                  <label htmlFor="start-date">Start Date</label>
                  <input ref="start_date" type="date" />
                </div>
                <div className="col s6">
                  <label htmlFor="end-date">End Date</label>
                  <input ref="end_date" type="date" />
                </div>
              </div>
              <input type="submit" className="modal-action modal-close waves-effect waves-green btn" value="Submit"/>
              <a href="#" className="waves-effect waves-light btn red right" onClick={this.deleteTerm}><i className="fa fa-trash fa-2x"></i></a>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
