var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
  token: String,
  lastUpdate: Date,
  boards: {},
  info: {},
  cache: {},
  html: {},
  member: {
    type: Schema.Types.ObjectId,
    ref: 'member'
  }
});