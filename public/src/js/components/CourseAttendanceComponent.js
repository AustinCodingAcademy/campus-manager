var React = require('react');
var moment = require('moment');
var LineChart = require('react-chartjs').Line;
var Chart = require('chart.heatmap.js');
require('react.backbone');

module.exports = React.createBackboneClass({
  rendered: false,

  componentDidUpdate: function() {
    if (this.getModel().get('student').data.datasets.length > 0 && !this.rendered) {
      var ctx = this.refs.heatmap.getContext('2d');
      var newChart = new Chart(ctx).HeatMap(this.getModel().get('student').data, this.getModel().get('student').options);
      this.rendered = true;
    }
  },

  render: function() {
    return (
      <div className="row">
        <div className="col s12">
          <h4>Attendance</h4>
          <LineChart data={this.getModel().get('overTime').data} ref="attendanceChart" options={this.getModel().get('overTime').options} />
          <canvas ref="heatmap"></canvas>
        </div>
      </div>
    );
  }
});
