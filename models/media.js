var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
  name: String,
  src: String,
  url: String,
  cdn: String,
  type: String,
  meta: {
    size: Number,
    lastModifiedDate: Date
  },
  pubdate: {
    type: Date,
    default: Date.now
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: 'member'
  }
});