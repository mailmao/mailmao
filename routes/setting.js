var async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	errHandler = require('../lib/error.js');

var checkAgain = function(e) {
		if(e == '') {
			return false;
		} else {
			return true;
		};
	}

module.exports = function(req, res) {

	if(req.session.uid) {

		var uTitle = req.body.uTitle,
			uEmail = req.body.uEmail,
			uBoard = req.body.uBoard,
			uSendToList = req.body.sendList;

		user.findById(req.session.uid).exec(function(err, doc) {
			if(err) {
				res.json({
					stat: 'error',
					msg: '出错了'
				});
			} else {
				if(checkAgain(uTitle)) {
					doc.setting.myTitle = uTitle
				};
				if(checkAgain(uEmail)) {
					doc.setting.myEmail = uEmail
				};
				if(checkAgain(uBoard)) {
					doc.setting.outputBoard = uBoard
				};
				if(checkAgain(uSendToList)) {
					doc.setting.sendToGroup = uSendToList
				};
				doc.save(function() {
					res.json({
						stat: 'ok',
						msg: '设置已更新'
					});
				});
			}
		});
} else {
	res.json({
		stat: 'error',
		msg: '请先登录'
	})
}
}