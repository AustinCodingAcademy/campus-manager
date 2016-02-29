var Backbone = require('backbone');
var React = require('react');
require('backbone-react-component');
var SessionItemComponent = require('./sessionItemComponent.js');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  render: function() {
    var sessionItems = this.state.collection.map(function(sessionItem) {
      return <SessionItemComponent  key={sessionItem.id} model={sessionItem} />
    });
    
    return (
      <div className="row">
        <div className="col s12">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {sessionItems}
            </tbody>
          </table>
          <a className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">add</i></a>
        </div>
      </div>
    );
  }
});
