// 触发邮件发送
var async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	errHandler = require('../lib/error.js'),
	sendMail = require('../lib/mail.js');

module.exports = function(req, res, next) {
	if(req.session.uid) {

		var bgIMG = req.body.bgIMG;
		var postTitle = req.body.postTitle;
		var sendList = req.body.sendToList;

		user.findById(req.session.uid).exec(function(err, doc) {
			if(!err) {
				var objFull = doc.cache;
				var send = {
					title: postTitle,
					sub : postTitle,
					list: sendList,
					bg: bgIMG,
					cnt: objFull,
					user: doc.weibo.info,
					tpl: 'default-table',
					_id: doc._id
				}

				sendMail(send, function(err,result){
					if (err == null) {
						res.json({
							stat: 'ok',
							msg: '邮件已成功发送'
						})
					} else {
						res.json({
							stat: 'error',
							msg: errHandler('mail')
						})
					}
				});

			} else {
				res.json({
					stat: 'error',
					msg: errHandler('db')
				})
			}
		});

	} else {
		res.json({
			stat: 'error',
			msg: "请先登录"
		})
	}
}