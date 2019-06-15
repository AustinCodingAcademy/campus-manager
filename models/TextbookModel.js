const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const version = require('mongoose-version');

const textbookSchema = new Schema({
  name: String,
  instructor_url: String,
  student_url: String,
  client: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

textbookSchema.plugin(version, { collection: 'textbooks__versions' });

module.exports = mongoose.model('textbook', textbookSchema);
