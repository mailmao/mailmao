var dbModel = require('../models.js');
var user = dbModel.user;
var errHandler = require('../lib/error.js');

module.exports = route;

function route(req, res) {
  if (!req.session.uid) 
    return res.redirect('/');

  user
    .findById(req.session.uid)
    .exec(response);

  function response(err, doc) {
    if (err) 
      return res.send(errHandler('db'));

    return res.render('mime-update', {
      pageTitle: '我的邮差猫',
      desc: '我的邮差猫个人主页',
      userInfo: req.session.user,
      trelloFlag: !!doc.trello.token,
      setting: doc.setting,
      trelloInfo: doc.trello.info || ''
    });
  }
}
