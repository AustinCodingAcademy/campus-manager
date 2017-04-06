const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const moment = require('moment');
const version = require('mongoose-version');

const termSchema = new Schema({
	start_date: Date,
	end_date: Date,
	name: String,
	client: {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
  courses: []
}, { timestamps: true });

termSchema.plugin(version, { collection: 'terms__versions' });

module.exports = mongoose.model('term', termSchema);
