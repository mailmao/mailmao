var dbModel = require('../models.js');
var user = dbModel.user;
var errHandler = require('../lib/error.js');

module.exports = function(req, res) {
  if (!req.session.uid) return res.redirect('/');
  user.findById(req.session.uid).populate('client').exec(function(err, doc) {
    if (!err) {
      // 判断是否授权trello,引导授权trelo
      var trelloFlag = doc.trello.token != '' ? true : false;
      console.log(doc)

      if (trelloFlag) {
        res.render('mime', {
          pageTitle: '我的邮差猫',
          desc: '我的邮差猫个人主页',
          userInfo: req.session.user,
          setting: doc.setting,
          trelloFlag: trelloFlag,
          user: req.session.user
        });
      } else {
        res.redirect('/mime/update');
      }
    } else res.send(errHandler('db'));
  });
}