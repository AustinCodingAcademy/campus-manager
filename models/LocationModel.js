var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongooseToCsv = require('mongoose-to-csv');
var version = require('mongoose-version');

var locationSchema = new Schema({  address: String,  name: String,  city: String,  state: String,  zipcode: String,  contact: String,  client: {    type: Schema.Types.ObjectId,    ref: 'user'  },  phone: String,  note: String}, { timestamps: true });

locationSchema.plugin(mongooseToCsv, {
  headers: 'id name city',
  constraints: {},
  virtuals: {
    id: function(doc) {
      return doc._id.toString();
    }
  }
});

locationSchema.plugin(version, { collection: 'locations__versions' });

module.exports = mongoose.model('location', locationSchema);
