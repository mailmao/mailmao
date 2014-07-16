// 引导用户授权trello
module.exports = function(req, res, next) {
  return res.render( res.locals.user.nickname ? 'trello' : '/sync');
};
