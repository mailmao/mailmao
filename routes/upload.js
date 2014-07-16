var fs = require('fs');
var md5 = require('MD5');
var user = require('../ctrlers/user');
var media = require('../ctrlers/media');

module.exports = function(req, res, next) {
  if (!req.files.uploadedImg) return;
  var upyunInfo = res.locals.Server.app.locals.site.upyun;
  var file = {};
  file.name = res.locals.user._id + '-' + md5(req.files.uploadedImg.name) + '.png';
  file.content = fs.readFileSync(req.files.uploadedImg.path);
  
  media.upyun(upyunInfo, file, function(err, data) {
    if (err) return next(err);
    user.queryById(res.locals.user._id, function(err, u) {
      if (err) return next(err);
      u.setting.banner = encodeURI(upyunInfo.baseUrl + file.name);
      u.save(function(err) {
        if (err) return next(err);
        return res.json({
          stat: 'ok',
          msg: '同步成功!',
          url: upyunInfo.baseUrl + file.name
        });
      });
    });
  });
};