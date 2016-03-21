var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
require('backbone-react-component');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  deleteRegistration: function() {
    this.props.model.destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.user.get('username')}</td>
        <td>{this.props.course.get('name')}</td>
        <td>{this.props.course.get('term').get('name')}</td>
        <td><a className="waves-effect waves-teal btn-flat" onClick={this.deleteRegistration}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
