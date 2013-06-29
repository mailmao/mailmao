module.exports = function(req, res) {
	if(req.session.uid) {

		delete req.session.uid;
		delete req.session.wbToken;
		delete req.session.user;

		res.redirect('back');
	} else {
		res.redirect('back');
	}
}