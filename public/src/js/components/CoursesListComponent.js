var React = require('react');
var ReactDOM = require('react-dom');
require('react.backbone');
var CourseItemComponent = React.createFactory(require('./CourseItemComponent.js'));
var CourseModalComponent = React.createFactory(require('./CourseModalComponent.js'));
var CourseModel = require('../models/CourseModel');
var TermsCollection = require('../collections/TermsCollection');

module.exports = React.createBackboneClass({
  newCourseModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(CourseModalComponent({
      terms: this.props.terms,
      collection: this.getCollection(),
      model: new CourseModel(),
      locations: this.props.locations
    }), $('#modal-container')[0]);
    $('#course-modal').modal('open');
  },

  render: function() {
    var that = this;
    var courseItems = this.getCollection().map(function(courseItem) {
      return CourseItemComponent({
        key: courseItem.id,
        terms: that.props.terms,
        model: courseItem,
        collection: that.getCollection(),
        currentUser: that.props.currentUser,
        locations: that.props.locations
      });
    });

    var hidden = this.props.currentUser.get('is_admin') ? '' : ' hidden';

    return (
      <div className="row">
        <div className="col s12">
          <br />
          <a className={'waves-effect waves-teal btn' + hidden} onClick={this.newCourseModal} data-test="new-course"><i className="material-icons left">add</i> course</a>
          <br />
          <table className="striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Term</th>
                <th>Days</th>
                <th>Seats</th>
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
