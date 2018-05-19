import React from 'react';

module.exports = React.createBackboneClass({
  render: function() {
    return (
      <div className="col s12 m6">
        <div className="card small">
          <div className="card-image waves-effect waves-block waves-light center-align">
            <canvas ref="canvas" width="175" height="175"></canvas>
          </div>
          <div className="card-content">
            <span className="card-title activator grey-text text-darken-4">{this.getModel().get("name")}<i className="material-icons right">more_vert</i></span>
          </div>
          <div className="card-reveal">
            <span className="card-title grey-text text-darken-4">{this.getModel().get("name")}<i className="material-icons right">close</i></span>
            <p>{'Registration: ' + this.getModel().get("full") + '%'}</p>
          </div>
        </div>
      </div>
    )
  }
});
