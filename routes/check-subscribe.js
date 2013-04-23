// check-subscribe.js
var md5 = require('../lib/md5.js'),
	async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	client = dbModel.client,
	errHandler = require('../lib/error.js');

module.exports = function(req,res,next) {

	var email = req.params.email;
	var uid = req.params.uid;
	var pin = req.query.confirm;

	async.waterfall([

	function(callback) {
		client.findOne({
			email: email
		}).exec(function(err, doc) {
			if(!err) {
				if(doc == null) {
					res.send('抱歉，操作失败，请前往申请订阅页面重试。')
				} else {
					if (doc.pin === pin) {
						callback(null, doc._id);
					} else {
						res.send('抱歉，订阅失败');
					}
				}
			} else {
				res.send(errHandler('db'))
			}
		})
	}, function(clientID, callback) {
		user.findById(uid).exec(function(err, doc) {
			if(!err) {
				if(doc) {
					if(doc.client.indexOf(clientID) == -1) {
						doc.client.push(clientID);
						doc.save(function(err) {
							if(!err) {
								res.send('恭喜，订阅成功！');
							} else {
								res.send(errHandler('db'))
							}
						})
					} else {
						res.send('您已经订阅了这个频道，不需要重复订阅')
					}
				}
			} else {
				res.send(errHandler('db'))
			}
		})
	}])
}