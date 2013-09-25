var async = require('async'),
	trello = require('../lib/trello'),
	user = require('../ctrlers/user'),
	_ = require('underscore');

var check = function(bid, boards) {
	var b;
	_.each(boards, function(board) {
		if (board.id == bid) {
			b = board;
		}
	});
	return b;
};

// 更新某个指定板块的cache
module.exports = function(req, res, next) {

	var uid = res.locals.user._id;
	var bid = req.body.bid;
	var key = res.locals.Server.app.locals.site.trello.key;

	// 先更新，再修改默认板块
	async.waterfall([
		function(callback) {
			user.read(uid, function(err, u) {
				callback(err, u);
			});
		}
	], function(err, user) {
		if (!err) {
			// 判断有没有指定板块
			if (bid) {
				var targetBoard = check(bid, user.trello.boards);
				// 修改默认输出板块为当前指定的板块
				if (targetBoard) {
					user.setting.outputBoard.id = targetBoard.id;
					user.setting.outputBoard.name = targetBoard.name;
				}
			}
			// 开始更新缓存
			trello.updateCache({
				bid: user.setting.outputBoard.id,
				token: user.trello.token,
				key: key
			}, function(err, results) {
				if (!err) {
					user.trello.cache = results;
					user.trello.save(function(err) {
						if (!err) {
							// 保存新的默认板块ID
							user.save(function(err) {
								if (!err) {
									res.json({
										stat: 'ok',
										msg: '输入板块的内容已经更新完毕...'
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
		} else {
			next(err);
		}
	});

}