var Backbone = require('backbone');
var _ = require('underscore');
var React = require('react');
require('backbone-react-component');
var TermCardComponent = require('./termCardComponent');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  render: function() {
    var cardItems = this.props.collection.map(function(cardItem) {
      return <TermCardComponent key={cardItem.id} model={cardItem} />
    });
    
    return(
      <div className="row">{cardItems}</div>
    )
  }
});
