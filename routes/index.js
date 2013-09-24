var _ = require('underscore'),
	async = require('async'),
	trelloLib = require('../lib/trello'),
	user = require('../ctrlers/user');

// home page
module.exports = function(req, res, next) {
	if (res.locals.user) {
		// 如果用户已登录
		async.waterfall([
			// 读取用户是否授权了trello
			function(callback) {
				user.read(res.locals.user._id, function(err, u) {
					callback(err, u);
				});
			},
			// 更新trello缓存
			function(user, callback) {
				var trello = user.trello;
				if (trello && trello.token) {
					// 如果已授权
					if (!trello.cache) {
						// 如果判断有缓存？
						var oid = user.setting.outputBoard.id;
						trelloLib.updateCache({
							bid: oid,
							token: trello.token,
							key: res.locals.Server.app.locals.site.trello.key
						}, function(err, data) {
							if (!err) {
								trello.cache = data;
								trello.save(function(err) {
									callback(err, user, trello);
								});
							} else {
								next(err)
							}
						});
					} else {
						callback(null, user, trello);
					}
				} else {
					res.redirect('/trello');
				}
			}
		], function(err, user, trello) {
			if (!err) {
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
			} else {
				next(err);
			}
		});
	} else {
		// 如无登录
		res.render('signin');
	}
}