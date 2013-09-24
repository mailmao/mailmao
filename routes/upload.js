var md5 = require('MD5'),
	fs = require('fs'),
	media = require('../ctrlers/media'),
	user = require('../ctrlers/user');

module.exports = function(req, res, next) {
	if (req.files.uploadedImg) {
		var upyunInfo = res.locals.Server.app.locals.site.upyun;
		var file = {
			name: res.locals.user._id + '-' + md5(req.files.uploadedImg.name) + '.png',
			content: fs.readFileSync(req.files.uploadedImg.path)
		};
		media.upyun(upyunInfo, file, function(err, data) {
			if (!err) {
				user.queryById(res.locals.user._id, function(err, u) {
					if (!err) {
						u.setting.banner = encodeURI(upyunInfo.baseUrl + file.name);
						u.save(function(err) {
							if (!err) {
								res.json({
									stat: 'ok',
									msg: '同步成功!',
									url: upyunInfo.baseUrl + file.name
								});
							} else {
								next(err);
							}
						});
					} else {
						next(err);
					}
				})
			} else {
				next(err);
			}
		});
	}
}