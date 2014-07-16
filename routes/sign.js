var Duoshuo = require('duoshuo');
var user = require('../ctrlers/user');
var async = require('async');

// MIDDLEWARE: 检查用户是否登录
exports.check = function(req, res, next) {
  passport(req, res, next, function() {
    // Not-authed
    res.redirect('/');
  });
};

// MIDDLEWARE: 检查用户是否登录（xhr）
exports.checkJSON = function(req, res, next) {
  passport(req, res, next, function() {
    next(new Error('login required'));
  });
};

// MIDDLEWARE: 为登录用户写入locals
exports.passport = function(req, res, next) {
  passport(req, res, next, function() {
    next();
  });
};

// MIDDLEWARE: 检查用户是否管理员用户
exports.checkAdmin = function(req, res, next) {
  if (res.locals.user && res.locals.user.type == 'admin') {
    next();
  } else {
    res.redirect('/');
  }
};

// 使用多说登录
exports.signin = function(req, res, next) {
  if (req.session.user) return res.redirect('/');
  var code = req.query.code;
  var duoshuo = new Duoshuo(res.locals.Server.app.locals.site.duoshuo);
  duoshuo.auth(code, function(err, result) {
    // 当通信正常时
    if (err) return next(err);
    var result = result.body;
    if (result.code !== 0) return next(new Error('多说登录出错，请稍后再试或者联系管理员，具体错误:' + result.errorMessage));
    // 当返回正确时

    async.waterfall([

      function(callback) {
        queryUser(result.user_id, function(err, u) {
          callback(err, u)
        });
      },
      function(u, callback) {
        if (u) {
          req.session.user = u;
          res.redirect('back');
        } else {
          user.count(function(err, count) {
            callback(err, count);
          });
        }
      },
      function(count, callback) {
        if (count == 0) {
          result['type'] = 'admin';
        };
        createUser(result, function(err, baby) {
          callback(err, count, baby);
        });
      }
    ], function(err, count, baby) {
      if (!err) {
        req.session.user = baby;
        res.redirect('/sync');
      } else {
        next(err);
      }
    });

  });
};

// 登出
exports.signout = function(req, res, next) {
  if (req.session.user) {
    delete req.session.user;
    res.redirect('back');
  } else {
    res.redirect('back');
  }
};

function passport(req, res, next, cb) {
  if (!req.session.user) return cb();
  res.locals.user = req.session.user;
  return next();
}

function queryUser(id, callback) {
  user.readByDsId(id, callback);
}

function createUser(result, callback) {
  user.create({
    type: result.type || 'normal',
    duoshuo: {
      user_id: result.user_id,
      access_token: result.access_token
    }
  }, callback);
}
