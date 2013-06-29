var async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	errHandler = require('../lib/error.js'),
	api = require('../lib/api.js');
	weibo = require('../lib/config.js')('weibo'),
	_config = require('../lib/config.js');

module.exports = function(req, res) {

  if (!req.session.uid) {

	var code = req.query.code;

	async.waterfall([

	function(callback) {
		api('POST', 'https://api.weibo.com/oauth2/access_token?client_id=' + weibo.key + '&client_secret=' + weibo.secret + '&grant_type=authorization_code&redirect_uri=' + weibo.redirect + '&code=' + code, function(data) {
			if(typeof(data.error) == 'undefined') {
				var token = data.access_token;
				var uid = data.uid;
				callback(null, uid, token);
			} else {
				// console.log(data)
				res.send(errHandler('wb'))
			}
		});
	}, function(uid, token, callback) {
		// 查看用户是否曾经登录过，有token和信息
		user.findOne({
			id: uid
		}).exec(function(err, doc) {
			if(!err) {
				if(doc) {
					// 更新token
					doc.weibo.token = token;
					doc.save(function(err) {
						if(!err) {
							// 如果是web登录
							req.session['uid'] = doc._id;
							req.session['wbToken'] = doc.weibo.token;
							req.session['user'] = doc.weibo.info;
							res.redirect(_config('root'));
						} else {
							res.send(errHandler('db'));
						}
					})
				} else {
					// 如果是新用户
					callback(null, uid, token);
				}
			}
		});
	}, function(uid, token, callback) {
		// 如果是新用户，获取用户信息
		api('GET', 'https://api.weibo.com/2/users/show.json?access_token=' + token + '&uid=' + uid, function(info) {
			if(typeof(info.error) == 'undefined') {
				callback(null, uid, token, info);
			} else {
				res.send(errHandler('wb'))
			}
		});
	}], function(err, uid, token, info) {

		if(!err) {

			// 保存新用户
			var newUser = new user({
				id: uid,
				weibo: {
					token: token,
					info: info
				}
			});

			newUser.save(function(err) {
				if(!err) {

					// 如果是web登录的新用户
					req.session['uid'] = newUser._id;
					req.session['wbToken'] = newUser.weibo.tokne;
					req.session['user'] = newUser.weibo.info;
					res.redirect(_config('root'));

				} else {
					res.send(errHandler('db'))
				}
			})

		}
	});

  } else {
  	res.redirect(_config('root'));
  }

}