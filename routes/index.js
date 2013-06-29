var dbModels = require('../models.js'),
	user = dbModels.user,
	errorHandler = require('../lib/error.js'),
	_ = require('underscore'),
	async = require('async'),
	updateTrelloCache = require('../lib/update-trello-cache.js'),
	weibo = require('../lib/config.js')('weibo'),
	root = require('../lib/config.js')('root');

// index page
module.exports = function(req, res, next) {

	if(req.session.uid) {

		async.waterfall([

		function(callback) {
			// 判断登录
			user.findById(req.session.uid).populate('client').exec(function(err, doc) {
				if(!err) {
					callback(null, doc);
				} else {
					res.send(errorHandler('db'));
				}
			})
		}, function(user, callback) {
			if(typeof(user.trello.token) != 'undefined' && user.trello.token != '') {
				// 已授权了trello
				req.session['trelloToken'] = user.trello.token;

				if(typeof(user.cache) != 'undefined' && typeof(user.cache.cards) == 'undefined') {

					// 如果没有缓存
					var oid = user.setting.outputBoard.id;

					updateTrelloCache(oid, user.trello.token, function(data) {
						callback(null, 'first', user, data);
					});

				} else {
					// 如果有缓存，用户曾经抓取过数据
					callback(null, 'old',user, user.cache);
				}
			} else {
				// 如果用户没授权trello
				res.redirect(root+'/trello');
			}
		}, function(stat,userInfo, cache, callback) {
			if(stat == 'first') {
				user.findById(req.session.uid).exec(function(err, doc) {
					if(!err) {
						doc.cache = cache;
						doc.save(function(err) {
							if(!err) {
								callback(null, userInfo,doc.cache);
							}
						})
					}
				})
			} else {
				callback(null, userInfo,cache)
			}
		}, function(user,cache, callback) {
			// 渲染最终页面
			res.render('home', {
				user: req.session.user,
				title: user.setting.title ? user.setting.title : user.setting.outputBoard.name,
				bg: user.setting.banner ? user.setting.banner : 'http://mailmao.b0.upaiyun.com/banners/default.jpg',
				clients: user.client,
				myemail: user.setting.email ? user.setting.email : '',
				lists: cache.cards,
				members: cache.members,
				checkLists: cache.checkLists,
				attrFile: cache.attrs.cards,
				boards: user.trello.info.boards,
				outputBoardID: user.setting.outputBoard.id,
				uid: user._id
			});
		}]);
	} else {
		// 如无登录
		res.render('notauth',{
			weibo: weibo
		});
	}
}