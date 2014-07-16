var dbModel = require('../models.js');
var user = dbModel.user;
var errHandler = require('../lib/error.js');

module.exports = function(req, res) {
  if (!req.session.uid) return res.redirect('/');
  user.findById(req.session.uid).exec(function(err, doc) {
    if (err) return res.send(errHandler('db'));
    console.log(doc);
    // 判断是否授权trello,引导授权trelo
    var trelloFlag = doc.trello.token ? true : false;
    var trelloInfo = doc.trello.info ? doc.trello.info : '';
    return res.render('mime-update', {
      pageTitle: '我的邮差猫',
      desc: '我的邮差猫个人主页',
      userInfo: req.session.user,
      trelloFlag: trelloFlag,
      setting: doc.setting,
      trelloInfo: trelloInfo
    });
  });
}
