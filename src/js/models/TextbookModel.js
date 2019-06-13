import * as Backbone from 'backbone';

module.exports = Backbone.Model.extend({
  urlRoot: 'api/textbooks',
  idAttribute: '_id',

  defaults: {
    name: '',
    instructor_url: '',
    student_url: ''
  }
});



