var async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	api = require('api'),
	_ = require('underscore');

module.exports = function(req, res) {

	if(req.session.uid) {

		var token = req.body.token;

		async.waterfall([

		function(callback) {

			// 获取到trello用户信息
			api('GET', 'https://api.trello.com/1/tokens/' + token + '/member?key=01ed33a0fe0a76f9e607b179659ff8dd', function(info) {
				callback(null, info)
			});

		}, function(info, callback) {

			// 获取用户所在板块信息
			api('GET', 'https://api.trello.com/1/members/' + info.id + '/boards?filter=open&fields=name&key=01ed33a0fe0a76f9e607b179659ff8dd&token=' + token, function(boards) {
				console.log(boards);
				callback(null, info, boards);
			});
			
		}, function(info, boards, callback) {

			user.findById(req.session.uid).exec(function(err, doc) {
				if(!err) {

					var defalutBoard = boards[0];

					doc.trello.token = token;
					doc.trello.info = info;
					doc.trello.info['boards'] = boards;
					doc.setting.outputBoard.name = defalutBoard.name;
					doc.setting.outputBoard.id = defalutBoard.id;

					doc.save(function(err){
						if (!err) {
							res.json({
								msg: '恭喜，trello token 已经更新',
								user: doc.trello.info.username,
								stat: 'ok'
							})
						} else {
							res.json({
								stat: 'error',
								msg: err
							})
						}
					});
				} else {
					res.json({
						stat: 'error',
						msg : err
					})
				}
			});

		}]);
	}
}