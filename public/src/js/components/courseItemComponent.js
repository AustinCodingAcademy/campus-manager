var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
require('backbone-react-component');
var CourseModalComponent = require('./courseModalComponent.js');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  courseModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<CourseModalComponent terms={this.props.terms} collection={this.props.collection} model={this.props.model}/>, $('#modal-container')[0]);
    $('#course-modal' + this.props.model.id).openModal();
    Materialize.updateTextFields();
  },
  
  deleteCourse: function() {
    this.props.model.destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.model.get('name')}</td>
        <td>{this.props.model.get('term').get('name')}</td>
        <td>{this.props.model.shortDays()}</td>
        <td>{this.props.model.get('seats')}</td>
        <td>
          <a className="waves-effect waves-teal btn-flat modal-trigger" onClick={this.courseModal}>
            <i className="material-icons">mode_edit</i>
          </a>
        </td>
        <td><a className="waves-effect waves-teal btn-flat" onClick={this.deleteCourse}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
