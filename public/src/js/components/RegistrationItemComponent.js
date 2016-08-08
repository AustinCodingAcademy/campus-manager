var React = require('react');
require('react.backbone');

module.exports = React.createBackboneClass({
  deleteRegistration: function() {
    var c = confirm('Are you sure you want to delete this registration?')
    if (c) {
      this.props.course.get('registrations').remove(this.props.user);
      this.props.course.save();
      this.getCollection().trigger('remove');
    }
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.user.fullName() + ' (' + this.props.user.get('username') + ')'}</td>
        <td>{this.props.course.get('term').get('name')}</td>
        <td>{this.props.course.get('name')}</td>
        <td><a className="waves-effect waves-teal btn-flat" onClick={this.deleteRegistration}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
