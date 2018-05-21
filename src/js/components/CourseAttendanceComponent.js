import * as React from 'react';
import {Line} from 'react-chartjs';
import Chart from 'chart.heatmap.js';
import { Row, Col, Panel } from 'react-bootstrap';

module.exports = React.createBackboneClass({
  componentDidUpdate() {
    if (this.getModel().get('student').data.datasets.length > 0) {
      const ctx = this.refs.heatmap.getContext('2d');
      const newChart = new Chart(ctx, { options: {
        layout: {
          padding: 0
        }
      } }).HeatMap(this.getModel().get('student').data, this.getModel().get('student').options);
    }
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    return (
      <Row>
        <Col xs={12} md={5}>
          <Panel header={<h3>Course Attendance</h3>}>
            <Line data={this.getModel().get('overTime').data} ref="attendanceChart" options={this.getModel().get('overTime').options} />
          </Panel>
        </Col>
        <Col xs={12} md={7}>
          <Panel header={<h3>Student Attendance</h3>}>
            <canvas ref="heatmap"></canvas>
          </Panel>
        </Col>
      </Row>
    );
  }
});
