var Backbone = require('backbone');
var React = require('react');
require('react.backbone');
var TermCardComponent = React.createFactory(require('./TermCardComponent'));

module.exports = React.createBackboneClass({
  render: function() {
    var cardItems = this.props.collection.map(function(cardItem) {
      return TermCardComponent({
        key: cardItem.id,
        model: cardItem
      })
    });

    return(
      <div className="row">{cardItems}</div>
    )
  }
});
