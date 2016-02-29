var Backbone = require('backbone');
var React = require('react');
require('backbone-react-component');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],

  render: function() {
    return (
      <tr>
        <td>{this.props.model.name}</td>
        <td>{this.props.model.user}</td>
        <td>{this.props.model.ip}</td>
      </tr>
    );
  }
});
