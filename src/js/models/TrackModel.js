var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/tracks',
  idAttribute: '_id',

  defaults: {
    name: '',
    courses: new Backbone.Collection()
  },

  parse: (obj) => {
    if (obj.courses) {
      const CoursesCollection = require('../collections/CoursesCollection');
      obj.courses = new CoursesCollection(obj.courses, { parse: true });
    }

    return obj;
  }
});
