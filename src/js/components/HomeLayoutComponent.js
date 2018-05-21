import React from 'react';
var TermCardComponent = React.createFactory(require('./TermCardComponent'));

module.exports = React.createBackboneClass({
  render: function() {
    var cardItems = this.getCollection().map(function(cardItem) {
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
