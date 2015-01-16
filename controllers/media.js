var model = require('../models');
var media = model.media;
var md5 = require('MD5');
var UPYun = require('../lib/upyun.js').UPYun;

exports.ls = ls;
exports.read = read;
exports.count = count;
exports.queryById = queryById;
exports.create = create;
exports.remove = remove;
exports.upyun = upyun;

function ls(cb) {
  media.find({}).exec(cb);
}

function count(cb) {
  media.count({}, cb);
}

function read(id, callback) {
  media.findById(id).populate('user').exec(callback);
}

function queryById(id, callback) {
  media.findById(id).exec(callback);
}

function create(baby, callback) {
  var baby = new media(baby);
  baby.save(callback)
}

function remove(id, callback) {
  media.findByIdAndRemove(id, callback);
}

function upyun(upyun, file, callback) {
  var upyun = new UPYun(upyun.bucket, upyun.user, upyun.password);
  var cave = upyun.baseUrl;

  upyun.setContentMD5(md5(file.content));
  upyun.setFileSecret('bac');
  upyun.writeFile('/banners/' + file.name, file.content, false, function(err, data) {
    callback(err, data);
  });
}
