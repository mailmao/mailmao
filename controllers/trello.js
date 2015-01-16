var model = require('../models');
var trello = model.trello;

// list trello caches
exports.ls = function(callback) {
  trello.find({}).exec(callback);
}

// count trello
exports.count = function(callback) {
  trello.count({}, callback);
}

// read
exports.read = function(id, callback) {
  trello.findById(id).populate('user').exec(callback);
}

// queryById
exports.queryById = function(id, callback) {
  trello.findById(id).exec(callback);
}

// Read a user by `user_id`
exports.readByUserId = function(id, callback) {
  trello.findOne({
    user: id
  }).exec(callback);
}

// 创建用户
exports.create = function(baby, callback) {
  var baby = new trello(baby);
  baby.save(callback)
}

// 更新用户
exports.update = function(id, body, callback) {
  trello.findByIdAndUpdate(id, body, callback)
}

// 删除用户
exports.remove = function(id, callback) {
  trello.findByIdAndRemove(id, callback)
}