var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var CourseModalComponent = React.createFactory(require('./CourseModalComponent'));

module.exports = React.createBackboneClass({
  courseModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(CourseModalComponent({
      terms: this.props.terms,
      collection: this.getCollection(),
      model: this.getModel()
    }), $('#modal-container')[0]);
    $('#course-modal' + this.getModel().id).modal('open');
    Materialize.updateTextFields();
  },

  deleteCourse: function() {
    this.getModel().destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td><a href={'#courses/' + this.getModel().id}>{this.getModel().get('name')}</a></td>
        <td>{this.getModel().get('term').get('name')}</td>
        <td>{this.getModel().shortDays()}</td>
        <td>{this.getModel().get('registrations').length + ' / ' + this.getModel().get('seats')}</td>
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
