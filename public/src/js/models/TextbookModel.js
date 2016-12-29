import { Model } from 'backbone';

module.exports = Model.extend({
  urlRoot: 'api/textbooks',
  idAttribute: '_id',

  defaults: {
    name: '',
    instructor_url: '',
    student_url: ''
  }
});
