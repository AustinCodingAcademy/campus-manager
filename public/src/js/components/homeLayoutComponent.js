var Backbone = require('backbone');
var React = require('react');
require('backbone-react-component');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],

  render: function() {
    return (
      <a href="#sessions">sessions</a>
    );
  }
});
