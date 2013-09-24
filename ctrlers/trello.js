var model = require('../models'),
    trello = model.trello;

// list trello caches
exports.ls = function(cb) {
    trello.find({}).exec(function(err, us) {
        if (!err) {
            cb(null, us)
        } else {
            cb(err);
        }
    });
}

// count trello
exports.count = function(cb) {
    trello.count({}, function(err, count) {
        if (!err) {
            cb(null, count)
        } else {
            cb(err);
        }
    });
}

// read
exports.read = function(id, cb) {
    trello.findById(id).populate('user').exec(function(err, t) {
        if (!err) {
            cb(null, t)
        } else {
            cb(err)
        }
    });
}

// queryById
exports.queryById = function(id, cb) {
    trello.findById(id).exec(function(err, trello) {
        if (!err) {
            cb(null, trello)
        } else {
            cb(err)
        }
    });
}

// 读取一个用户by user_id
exports.readByUserId = function(id, cb) {
    trello.findOne({
        user: id
    }).exec(function(err, t) {
        if (!err) {
            cb(null, t)
        } else {
            cb(err)
        }
    });
}

// 创建用户
exports.create = function(baby, cb) {
    var baby = new trello(baby);
    baby.save(function(err) {
        if (!err) {
            cb(null, baby);
        } else {
            cb(err)
        }
    })
}

// 更新用户
exports.update = function(id, body, cb) {
    trello.findByIdAndUpdate(id, body, function(err) {
        if (!err) {
            cb(null, body);
        } else {
            cb(err)
        }
    })
}

// 删除用户
exports.remove = function(id) {
    trello.findByIdAndRemove(id, function(err) {
        if (!err) {
            cb(null, id)
        } else {
            cb(err)
        }
    })
}