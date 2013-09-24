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

	async.waterfall([
		function(callback) {
			user.read(uid, function(err, u) {
				if (!err) {
					if (bid) {
						var targetBoard = check(bid, u.trello.boards);
						// 修改默认输出板块为当前指定的板块
						if (targetBoard) {
							u.setting.outputBoard.id = targetBoard.id;
							u.setting.outputBoard.name = targetBoard.name;
						} // 否则按照原来的默认输出板块更新
						u.save(function(err) {
							callback(err, u);
						});
					} else {
						// 如果没有制定，就按照默认板块更新
						callback(null, u);
					}
				} else {
					next(err)
				}
			});
		}
	], function(err, user) {
		if (!err) {
			trello.updateCache({
				bid: user.setting.outputBoard.id,
				token: user.trello.token,
				key: key
			}, function(err, results) {
				if (!err) {
					user.trello.cache = results;
					user.trello.save(function(err) {
						if (!err) {
							res.json({
								stat: 'ok',
								msg: '输入板块的内容已经更新完毕...'
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