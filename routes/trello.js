module.exports = route;

function route(req, res, next) {
  res.render(
    res.locals.user.nickname ? 'trello' : '/sync'
  );
}
