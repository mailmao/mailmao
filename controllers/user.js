var model = require('../models');
var user = model.user;
var moment = require('moment');
var Duoshuo = require('duoshuo');

// list users
exports.ls = function(callback) {
  return user.find({}).exec(callback);
};

// count users
exports.count = function(callback) {
  return user.count({}, callback);
};

// read
exports.read = function(id, callback) {
  return user.findById(id).populate('trello').exec(callback);
}

// queryById
exports.queryById = function(id, callback) {
  return user.findById(id).exec(callback);
}

// 读取一个用户by user_id
exports.readByDsId = function(id, callback) {
  return user.findOne({
    'duoshuo.user_id': id
  }).exec(callback);
};

// 创建用户
exports.create = function(baby, callback) {
  var baby = new user(baby);
  baby.save(function(err) {
    return callback(err, baby);
  });
};

// 同步一个用户到多说
exports.sync = function(config, user, callback) {
  var duoshuo = new Duoshuo(config);
  var typeMap = {
    admin: 'administrator',
    editor: 'editor',
    author: 'author',
    normal: 'user'
  };
  var u = {
    user_key: user._id,
    name: user.nickname,
    role: typeMap[user.type],
    avatar_url: user.avatar,
    url: user.url,
    created_at: moment(user.created).format('YYYY-MM-DD hh:MM:ss')
  };
  // sync user info
  duoshuo.join({
    info: u,
    access_token: user.duoshuo.access_token
  }, callback);
}

// 更新用户
exports.update = function(id, body, callback) {
  return user.findByIdAndUpdate(id, body, function(err) {
    return callback(err, body);
  });
};

// 删除用户
exports.remove = function(id, callback) {
  return user.findByIdAndRemove(id, function(err) {
    return callback(err, id);
  });
};
