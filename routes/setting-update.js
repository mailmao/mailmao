var dbModel = require('../models.js'),
	user = dbModel.user,
	errHandler = require('../lib/error.js');

module.exports = function(req, res) {
	if(req.session.uid) {
		user.findById(req.session.uid).exec(function(err, doc) {
			if(!err) {

				console.log(doc);
				
				// 判断是否授权trello,引导授权trelo
				var trelloFlag = doc.trello.token ? true : false;
				var trelloInfo = doc.trello.info ? doc.trello.info : '';

				res.render('mime-update', {
					pageTitle: '我的邮差猫',
					desc: '我的邮差猫个人主页',
					userInfo: req.session.user,
					trelloFlag: trelloFlag,
					setting: doc.setting,
					trelloInfo: trelloInfo
				});

			} else {
				res.send(errHandler('db'));
			}
		});
	} else {
		res.redirect('/');
	}
}