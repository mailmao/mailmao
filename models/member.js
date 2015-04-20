var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
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
  settings: {
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
