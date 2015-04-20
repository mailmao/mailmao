exports.logger = function(err, req, res, next) {
  console.log(err);
  next(err);
};

exports.xhr = function(err, req, res, next) {
  if (req.xhr) {
    res.json(500, {
      stat: 'error',
      error: err
    });
  } else {
    next(err);
  }
};

exports.common = function(err, req, res, next) {
  if (err.toString() == 'Error: 404') {
    exports.notfound(req, res, next);
  } else {
    res.status(500);
    res.render('error', {
      code: 500,
      error: err
    })
  }
};

exports.notfound = function(req, res, next) {
  res.status(404);
  res.format({
    text: function() {
      res.send('404');
    },
    html: function() {
      res.render('error', {
        code: 404,
        error: req.url
      });
    },
    json: function() {
      res.json({
        stat: '404',
        error: 'not found'
      })
    }
  });
};
