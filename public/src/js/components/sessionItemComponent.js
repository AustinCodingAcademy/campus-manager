var Backbone = require('backbone');
var React = require('react');
var moment = require('moment');
require('backbone-react-component');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  deleteSession: function() {
    this.props.model.destroy({
      wait: true
    });
  },

  render: function() {
    return (
      <tr>
        <td>{this.state.model.name}</td>
        <td>{moment(this.state.model.start_date).format("MMM D, YYYY")}</td>
        <td>{moment(this.state.model.end_date).format("MMM D, YYYY")}</td>
        <td>
          <a className="waves-effect waves-teal btn-flat">
            <i className="material-icons">mode_edit</i>
          </a>
        </td>
        <td><a className="waves-effect waves-teal btn-flat" onClick={this.deleteSession}><i className="material-icons">delete</i></a></td>
      </tr>
    );
  }
});
