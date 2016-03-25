var Backbone = require('backbone');
var _ = require('underscore');
var TermCardView = require('./TermCardView');

module.exports = Backbone.View.extend({
  el:'<div class="row"></div>',
  
  chartViews: [],
  
  initialize: function() {
    this.listenTo(this.collection, 'update', function() {
      this.render();
      this.insertCharts();
    }, this);
  },
  
  render: function() {
    this.$el.html('');
    this.collection.each(function(item) {
      var termCardView = new TermCardView({ model: item });
      this.$el.append(termCardView.render().el);
      this.chartViews.push(termCardView);
    }, this)
    return this;
  },
  
  insertCharts: function() {
    _.each(this.chartViews, function(chartView) {
      chartView.insertChart();
    });
  }
});
