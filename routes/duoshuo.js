var user = require('../ctrlers/user');

exports.page = function(req, res, next) {
  res.render('sync');
}

exports.sync = function(req, res, next) {
  var uu = req.body.user;
  if (uu && typeof(uu) == 'object') {
    user.queryById(res.locals.user._id, function(err, u) {
      if (!err) {
        u.nickname = uu.name;
        u.url = uu.url;
        u.avatar = uu.avatar;
        u.save(function(err) {
          if (!err) {
            // 同步本地用户到多说
            user.sync(res.locals.Server.app.locals.site.duoshuo, u, function(err, result) {
              if (!err) {
                var result = result.body;
                if (result.code == 0) {
                  req.session.user = u;
                  res.json({
                    stat: 'ok',
                    user: u
                  });
                } else {
                  next(new Error('多说用户同步失败，请稍后再试，详细错误：' + result.errorMessage))
                }
              } else {
                next(err);
              }
            });
          } else {
            next(err)
          }
        });
      } else {
        next(err)
      }
    });
  }
}