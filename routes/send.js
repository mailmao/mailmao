var user = require('../ctrlers/user'),
	email = require('../ctrlers/email');

// 触发邮件发送
module.exports = function(req, res, next) {

	var bgIMG = req.body.bgIMG;
	var postTitle = req.body.postTitle;
	var sendList = req.body.sendToList;
	var sender = res.locals.Server.app.locals.site.smtp;

	user.read(res.locals.user._id, function(err, u) {
		if (!err) {
			var cache = u.trello.cache;
			email('default.jade', {
				sender: sender,
				mail: {
					title: postTitle,
					sub: postTitle,
					list: sendList,
					bg: bgIMG,
					lists: cache.cards,
					members: cache.members,
					checkLists: cache.checkLists,
					attrFile: cache.attrs.cards,
					user: u,
					sys: res.locals.Server.app.locals.sys,
					site: res.locals.Server.app.locals.site
				}
			}, function(err, result) {
				if (!err) {
					res.json({
						stat: 'ok',
						msg: '邮件已成功发送'
					})
				} else {
					next(err)
				}
			});

		} else {
			next(err);
		}
	});
}