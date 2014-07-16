/**
 * db configs
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./database');
var db = mongoose.createConnection('localhost', config.name);

// user model
var userModel = new Schema({
  nickname: String,
  email: String,
  avatar: String,
  password: String,
  phone: String,
  url: String,
  type: {
    type: String,
    default: 'normal'
  },
  created: {
    type: Date,
    default: Date.now
  },
  duoshuo: {
    user_id: {
      type: String,
      unique: true
    },
    access_token: String
  },
  trello: {
    type: Schema.Types.ObjectId,
    ref: 'trello'
  },
  setting: {
    title: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    banner: {
      type: String,
      default: ''
    },
    outputBoard: {
      name: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: ''
      }
    }
  }
});

// trello cache model
var trelloModel = new Schema({
  token: String,
  lastUpdate: Date,
  boards: {},
  info: {},
  cache: {},
  html: {},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

// media
var mediaModel = new Schema({
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

exports.user = db.model('user', userModel);
exports.trello = db.model('trello', trelloModel);
exports.media = db.model('media', mediaModel);
