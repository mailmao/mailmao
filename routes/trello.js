// trello
module.exports = function(req, res, next) {
	if(req.session.uid) {
		// 引导用户授权trello
		res.render('trello', {
			user: req.session.user
		})
	} else {
		res.redirect('/')
	}
}