var Backbone = require('backbone');
var _ = require('underscore');
var Chart = require('chart.js');

module.exports = Backbone.View.extend({
  el:'<div class="col s12 m6"></div>',
  template: _.template('\
    <div class="card small">\
      <div class="card-image waves-effect waves-block waves-light center-align">\
        <canvas width="175" height="175"></canvas>\
      </div>\
      <div class="card-content">\
        <span class="card-title activator grey-text text-darken-4"><%= model.get("name") %><i class="material-icons right">more_vert</i></span>\
      </div>\
      <div class="card-reveal">\
        <span class="card-title grey-text text-darken-4"><%= model.get("name") %><i class="material-icons right">close</i></span>\
        <p>Registration: <%= model.get("full") %></p>\
      </div>\
    </div>\
  '),
  
  render: function() {
    this.$el.html(this.template({model: this.model}));
    return this;
  },
  
  insertChart: function() {
    new Chart(this.$el.find('canvas')[0].getContext('2d')).Doughnut([
      {
        value: this.model.get('full'),
        color: this.model.get('health_color'),
        label: "Health"
      },
      {
        value: 100 - this.model.get('full'),
        color: "#ffffff",
        label: ""
      }
    ]);
  }
});
