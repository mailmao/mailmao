var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var configs = require('../configs.json');
var db = mongoose.createConnection('localhost', configs.database.name);

exports.member = db.model('member', require('./member'));
exports.trello = db.model('trello', require('./trello'));
exports.media = db.model('media', mediaModel);
