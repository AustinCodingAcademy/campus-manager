var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongooseToCsv = require('mongoose-to-csv');

var locationSchema = new Schema({  address : String,  name : String,  city : String,  state : String,  zipcode : String,  contact : String,  client : {    type: Schema.Types.ObjectId,    ref: 'user'  },  phone: String,  note: String});

locationSchema.plugin(mongooseToCsv, {
  headers: 'id name city',
  constraints: {},
  virtuals: {
    id: function(doc) {
      return doc._id.toString();
    }
  }
});

module.exports = mongoose.model('location', locationSchema);
