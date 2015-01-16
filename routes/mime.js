var dbModel = require('../models.js');
var user = dbModel.user;
var errHandler = require('../lib/error.js');

module.exports = route;

function route(req, res) {
  if (!req.session.uid) 
    return res.redirect('/');

  user
    .findById(req.session.uid)
    .populate('client')
    .exec(response);

  function response(err, doc) {
    if (err)
      return res.send(errHandler('db'));

    // 判断是否授权 trello, 引导授权 trello
    var trelloFlag = doc.trello.token != '';

    if (!trelloFlag)
      return res.redirect('/mime/update');

    res.render('mime', {
      pageTitle: '我的邮差猫',
      desc: '我的邮差猫个人主页',
      userInfo: req.session.user,
      setting: doc.setting,
      trelloFlag: trelloFlag,
      user: req.session.user
    });
  }
}