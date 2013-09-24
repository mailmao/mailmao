var user = require('../ctrlers/user');

// 这段校验逻辑需要优化
var checkAgain = function(e) {
	if (e == '') {
		return false;
	} else {
		return true;
	};
}

// update settings
module.exports = function(req, res) {
	var uTitle = req.body.uTitle,
		uEmail = req.body.uEmail,
		uBoard = req.body.uBoard,
		uSendToList = req.body.sendList;

	user.queryById(res.locals.user._id, function(err, u){
		if (!err) {
			if (checkAgain(uTitle)) {
				u.setting.myTitle = uTitle
			};
			if (checkAgain(uEmail)) {
				u.setting.myEmail = uEmail
			};
			if (checkAgain(uBoard)) {
				u.setting.outputBoard = uBoard
			};
			if (checkAgain(uSendToList)) {
				u.setting.sendToGroup = uSendToList
			};
			u.save(function() {
				res.json({
					stat: 'ok',
					msg: '设置已更新'
				});
			});
		} else {
			next(err)
		}
	});
};