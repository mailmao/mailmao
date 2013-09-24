// 引导用户授权trello
module.exports = function(req, res, next) {
    if (res.locals.user.nickname) {
        res.render('trello');
    } else {
        res.redirect('/sync');
    }
}