var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
require('backbone-react-component');
var CourseItemComponent = require('./courseItemComponent.js');
var CourseModalComponent = require('./courseModalComponent.js');
var CourseModel = require('../models/courseModel');
var TermsCollection = require('../collections/termsCollection');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],

  newCourseModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<CourseModalComponent terms={this.props.terms} collection={this.props.collection} model={new CourseModel()} />, $('#modal-container')[0]);
    $('#course-modal').openModal();
  },

  render: function() {
    var that = this;
    var courseItems = this.props.collection.map(function(courseItem) {
      return <CourseItemComponent key={courseItem.id} terms={that.props.terms} model={courseItem} collection={that.props.collection}/>
    });

    return (
      <div className="row">
        <div className="col s12">
          <br />
          <a className="waves-effect waves-teal btn modal-trigger" onClick={this.newCourseModal}><i className="material-icons left">add</i> course</a>
          <br />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Term</th>
                <th>Days</th>
                <th>Seats Avai.</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courseItems}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});
