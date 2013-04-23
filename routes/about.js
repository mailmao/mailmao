module.exports = function(req, res) {
	res.render('about', {
		pageTitle: '关于本喵',
		desc: '关于邮差猫',
		user: req.session.user ? req.session.user : ''
	});
}