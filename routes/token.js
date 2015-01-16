var user = require('../ctrlers/user');
var trello = require('../lib/trello');
var trelloCtrl = require('../ctrlers/trello');

module.exports = route;

// 更新 trello 用户信息与板块列表
function route(req, res, next) {
  var token = req.body.token;
  var key = res.locals.Server.app.locals.site.trello.key;
  var uid = res.locals.user._id;

  // 先读取用户信息，如果已经有 trello token 了就不要再获取 trello 信息了
  if (!token)
    return next(new Error('token required!'));

  user.read(uid, function(err, u) {
    if (u.trello && u.trello.token) {
      // 如果已经授权过 trello 的话，更新 token，不更新信息
      u.trello.token = token;
      u.save(function(err) {
        if (err)
          return next(err)

        res.json({
          msg: '恭喜，trello token 已经更新',
          user: u.trello.info.username,
          stat: 'ok'
        });
      });
    } else {
      // 如果从未授权过 trello，则获取用户信息和板块列表信息
      trello.updateInfo({
        key: key,
        token: token
      }, function(err, info, boards) {
        if (err)
          return next(err);

        // 如果没有 token，新建一个 trello 实体
        var defalutBoard = boards[0];
        trelloCtrl.create({
          token: token,
          info: info,
          boards: boards,
          user: uid
        }, function(err, baby) {
          u.trello = baby._id;
          u.setting.outputBoard.name = defalutBoard.name;
          u.setting.outputBoard.id = defalutBoard.id;
          u.save(function(err) {
            if (err)
              return next(err);

            res.json({
              msg: '恭喜，trello token 已经更新',
              user: baby.info.username,
              stat: 'ok'
            });
          })
        });
      })
    }
  });
}