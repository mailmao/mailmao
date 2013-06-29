var async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	errHandler = require('../lib/error.js'),
	updateTrelloCache = require('../lib/update-trello-cache.js'),
	_ = require('underscore');

module.exports = function(req, res) {
	if(req.session.uid) {

		async.waterfall([

			function(callback) {
				user.findById(req.session.uid).exec(function(err, doc) {
					if(!err) {
						var trelloToken = doc.trello.token;
						var uid = doc._id;
						var bid = req.body.bid;
						if(bid != null) {
							var boards = doc.trello.info.boards;
							var b = {};
							_.each(boards, function(board) {
								if(board.id == bid) {
									b['id'] = board.id;
									b['name'] = board.name;
								}
							});
							// 如果用户没有这个板块，id就会是undefined
							if (typeof(b.id) != 'undefined') {
								doc.setting.outputBoard.id = b.id;
								doc.setting.outputBoard.name = b.name;
							} // 否则按照原来的默认输出板块更新
							doc.save(function(err) {
								if(!err) {
									callback(null, trelloToken, uid, doc.setting.outputBoard.id)
								}
							})
						} else {
							callback(null, trelloToken, uid, doc.setting.outputBoard.id);
						}

					} else {
						res.json({
							stat: 'error',
							msg: errHandler('db')
						})
					}
				})
			},
			function(trelloToken, uid, bid, callback) {
				updateTrelloCache(bid, trelloToken, function(cache) {
					user.findById(req.session.uid).exec(function(err, doc) {
						if(!err && doc) {
							doc.cache = cache;
							doc.save(function(err) {
								if(!err) {
									res.json({
										stat: 'ok',
										msg: '输入板块的内容已经更新完毕...'
									})
								} else {
									res.json({
										stat: 'err',
										msg: errorHandler('db')
									})
								}
							})
						}
					})
				})
			}
		])

	} else {
		res.json({
			stat: 'error',
			msg: 'login first'
		})
	}
}