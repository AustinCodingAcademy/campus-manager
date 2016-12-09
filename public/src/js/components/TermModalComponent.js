var React = require('react');
require('react.backbone');
var TermModel = require('../models/TermModel');
var moment = require('moment');

module.exports = React.createBackboneClass({
  componentDidMount: function() {
    this.refs.name.value = this.getModel().get('name');
    $(this.refs.start_date).pickadate().pickadate('picker').set('select', moment.utc(this.getModel().get('start_date')).format('D MMMM, YYYY'), { muted: true });
    $(this.refs.end_date).pickadate().pickadate('picker').set('select', moment.utc(this.getModel().get('end_date')).format('D MMMM, YYYY'), { muted: true });
    $('select').material_select();
    $('.modal').modal();
    Materialize.updateTextFields();
  },

  saveTerm: function(e) {
    e.preventDefault();
    var that = this;

    this.getModel().save({
      name: this.refs.name.value,
      start_date: this.refs.start_date.value,
      end_date: this.refs.end_date.value
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
          $('#term-modal').modal('close');
        }
      });
    }
  },

  render: function() {

    return (
      <div id={'term-modal' + (this.getModel().id ? this.getModel().id  : '')} className="modal">
        <div className="modal-content">
          <div className="row">
            <form className="col s12" onSubmit={this.saveTerm}>
              <div className="row">
                <div className="input-field col s12">
                  <input ref="name" type="text" className="validate" data-test="term-name"/>
                  <label htmlFor="name">Name</label>
                </div>
              </div>
              <div className="row">
                <div className="col s6">
                  <label htmlFor="start-date">Start Date</label>
                  <input ref="start_date" type="date" data-test="term-start-date" />
                </div>
                <div className="col s6">
                  <label htmlFor="end-date">End Date</label>
                  <input ref="end_date" type="date" data-test="term-end-date"/>
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
