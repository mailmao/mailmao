var _ = require('underscore');
var async = require('async');
var trelloLib = require('../lib/trello');
var user = require('../ctrlers/user');

module.exports = routeIndex;

function routeIndex(req, res, next) {
  if (!res.locals.user)
    return res.render('signin');

  // 如果用户已登录
  async.waterfall([
    // 读取用户是否授权了trello
    function(callback) {
      user.read(res.locals.user._id, callback);
    },
    // 更新trello缓存
    function(user, callback) {
      var trello = user.trello;

      if (!(trello && trello.token))
        return res.redirect('/trello');
      if (trello.cache)
        return callback(null, user, trello);

      // 如果判断有缓存？
      var oid = user.setting.outputBoard.id;
      trelloLib.updateCache({
        bid: oid,
        token: trello.token,
        key: res.locals.Server.app.locals.site.trello.key
      }, function(err, data) {
        if (err)
          return next(err)

        trello.cache = data;
        trello.save(function(err) {
          callback(err, user, trello);
        });
      });
    }
  ], function(err, user, trello) {
    if (err)
      return next(err);

    // 待优化
    var cache = trello.cache;
    res.render('home', {
      uid: user._id,
      user: user,
      trello: trello,
      title: user.setting.title ? user.setting.title : user.setting.outputBoard.name,
      bg: user.setting.banner ? user.setting.banner : 'http://mailmao.b0.upaiyun.com/banners/default.jpg',
      lists: cache.cards,
      members: cache.members,
      checkLists: cache.checkLists,
      attrFile: cache.attrs.cards
    });
  });
}