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
      model: this.getModel(),
      locations: this.props.locations
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
    var hidden = this.props.currentUser.get('is_admin') ? '' : ' hidden';
    return (
      <tr>
        <td><a href={'#courses/' + this.getModel().id}>{this.getModel().get('name')}</a></td>
        <td>{this.getModel().get('location') ? this.getModel().get('location').get('name') : ''}</td>
        <td>{this.getModel().get('term').get('name')}</td>
        <td>{this.getModel().shortDays()}</td>
        <td>{this.getModel().get('registrations').length + ' / ' + this.getModel().get('seats')}</td>
        <td>{this.getModel().get('cost')}</td>
        <td>
          <a className={'waves-effect waves-teal btn-flat' + hidden} onClick={this.courseModal}>
            <i className="material-icons">mode_edit</i>
          </a>
        </td>
        <td><a className={'waves-effect waves-teal btn-flat' + hidden} onClick={this.deleteCourse}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
