var user = require('../ctrlers/user');

exports.home = function(req, res, next) {
  user.read(res.locals.user._id, function(err, u) {
    if (err) return next(err);
    res.render(u.trello.token ? 'mime': '/trello');
  });
};

exports.update = function(req, res, next) {
  user.read(res.locals.user._id, function(err, u) {
    if (err) return next(err);
    return res.render(u.trello.token ? 'mime-update' : '/trello');
  });
};
