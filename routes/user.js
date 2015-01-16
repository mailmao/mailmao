var user = require('../ctrlers/user');

exports.home = home;
exports.update = update;

function home(req, res, next) {
  user.read(res.locals.user._id, function(err, u) {
    if (err) 
      return next(err);

    res.render(u.trello.token ? 'mime': '/trello');
  });
}

function update(req, res, next) {
  user.read(res.locals.user._id, function(err, u) {
    if (err) 
      return next(err);

    return res.render(u.trello.token ? 'mime-update' : '/trello');
  });
}
