var Backbone = require('backbone');
var React = require('react');
require('backbone-react-component');
var TermItemComponent = require('./termItemComponent.js');
var TermModalComponent = require('./termModalComponent.js');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  
  newTermModal: function() {
    $('#term-modal').openModal();
  },
  
  componentDidMount: function() {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
      container: 'body',
      klass: {
        picker: 'picker z-top'
      }
    });
  },
  
  render: function() {
    var that = this;
    var termItems = this.props.collection.map(function(termItem) {
      return <TermItemComponent key={termItem.id} model={termItem} collection={that.props.collection}/>
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
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {termItems}
            </tbody>
          </table>
          <a className="waves-effect waves-teal btn modal-trigger" onClick={this.newTermModal}><i className="material-icons left">add</i> term</a>
          <TermModalComponent collection={this.props.collection}/>
        </div>
      </div>
    );
  }
});
