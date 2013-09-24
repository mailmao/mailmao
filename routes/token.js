var user = require('../ctrlers/user'),
	trello = require('../lib/trello'),
	trelloCtrl = require('../ctrlers/trello');

// 更新trello 用户信息与板块列表
module.exports = function(req, res, next) {

	var token = req.body.token,
		key = res.locals.Server.app.locals.site.trello.key,
		uid = res.locals.user._id;

	// 先读取用户信息，如果已经有trello token了就不要再获取trello信息了
	if (token) {
		user.read(uid, function(err, u) {
			if (u.trello && u.trello.token) {
				// 如果已经授权过trello的话，更新token，不更新信息
				u.trello.token = token;
				u.save(function(err){
					if (!err) {
						res.json({
							msg: '恭喜，trello token 已经更新',
							user: u.trello.info.username,
							stat: 'ok'
						});
					} else {
						next(err);
					}
				});
			} else {
				// 如果从未授权过trello，则获取用户信息和板块列表信息
				trello.updateInfo({
					key: key,
					token: token
				},function(err, info, boards){
					if (!err) {
						// 如果没有token，新建一个trello实体
						var defalutBoard = boards[0];
						trelloCtrl.create({
							token: token,
							info: info,
							boards: boards,
							user: uid
						}, function(err, baby) {
							u.trello = baby._id;
							u.setting.outputBoard.name = defalutBoard.name;
							u.setting.outputBoard.id = defalutBoard.id;
							u.save(function(err) {
								if (!err) {
									res.json({
										msg: '恭喜，trello token 已经更新',
										user: baby.info.username,
										stat: 'ok'
									})
								} else {
									next(err)
								}
							})
						});
					} else {
						next(err);
					}
				})
			}
		});
	} else {
		next(new Error('token required!'));
	}
}