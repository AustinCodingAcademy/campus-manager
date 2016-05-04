var Backbone = require('backbone');
var React = require('react');
require('backbone-react-component');
var Chart = require('chart.js');

module.exports = React.createClass({
  componentDidUpdate: function() {
    new Chart(this.refs.canvas.getContext('2d')).Doughnut([
      {
        value: this.props.model.get('full'),
        color: this.props.model.get('health_color'),
        label: "Health"
      },
      {
        value: 100 - this.props.model.get('full'),
        color: "#ffffff",
        label: ""
      }
    ]);
  },
  
  render: function() {
    return (
      <div className="col s12 m6">
        <div className="card small">
          <div className="card-image waves-effect waves-block waves-light center-align">
            <canvas ref="canvas" width="175" height="175"></canvas>
          </div>
          <div className="card-content">
            <span className="card-title activator grey-text text-darken-4">{this.props.model.get("name")}<i className="material-icons right">more_vert</i></span>
          </div>
          <div className="card-reveal">
            <span className="card-title grey-text text-darken-4">{this.props.model.get("name")}<i className="material-icons right">close</i></span>
            <p>{'Registration: ' + this.props.model.get("full") + '%'}</p>
          </div>
        </div>
      </div>
    )
  }
});
