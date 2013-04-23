// unsubscribe
var md5 = require('md5'),
	async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	errHandler = require('../lib/error.js');

module.exports = function(req, res, next) {

	var uid = req.params.uid;
	var emailID = req.params.email;
	var code = req.query.code;
	var parseEmail = md5(emailID + 'f00kyou!!!');

	if(parseEmail === code) {

		user.findById(uid).exec(function(err, doc) {
			if(!err) {
				if(doc.client.indexOf(emailID) > -1) {
					doc.client.remove(emailID);
					doc.save(function(err) {
						if(!err) {
							res.send('取消订阅成功')
						}
					})
				} else {
					res.send('您好像并没有订阅这个邮件列表')
				}
			} else {
				res.send(errHandler('db'));
			}
		})
	} else {
		res.send('你没有权限取消别人的订阅。')
	}
}