var user = require('../controllers/user');

exports.page = page;
exports.sync = sync;

function page(req, res, next) {
  res.render('sync');
}

function sync(req, res, next) {
  var uu = req.body.user;
  
  if (!(uu && typeof(uu) == 'object'))
    return next(new Error('params invalid'))

  user.queryById(res.locals.user._id, function(err, u) {
    if (err)
      return next(err);

    u.nickname = uu.name;
    u.url = uu.url;
    u.avatar = uu.avatar;
    u.save(function(err) {
      if (err)
        return next(err)

      // 同步本地用户到多说
      user.sync(
        res.locals.Server.app.locals.site.duoshuo, 
        u, 
        function(err, result) {
        if (err)
          return next(err);

        if (result.body.code !== 0)
          return next(new Error('多说用户同步失败，请稍后再试，详细错误：' + result.body.errorMessage));

        req.session.user = u;
        res.json({
          stat: 'ok',
          user: u
        });
      });
    });
  });
}
