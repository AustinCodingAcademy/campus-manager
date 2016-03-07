var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/users',
  idAttribute: '_id',
  
  defaults: {
    idn: '',
    is_student: false,
    is_admin: false,
    is_instructor: false,
    github: '',
    website: '',
    phone: '',
    username: '',
    first_name: '',
    last_name: ''
  },
  
  fullName: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  },
  
  roles: function() {
    var roles = [];
    if (this.get('is_client')) {
      roles.push('client');
    }
    if (this.get('is_admin')) {
      roles.push('admin');
    }
    if (this.get('is_instructor')) {
      roles.push('instructor');
    }
    if (this.get('is_student')) {
      roles.push('student');
    }
    return roles.join(', ');
  }
});
