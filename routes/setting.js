var user = require('../ctrlers/user');

module.exports = route;

function route(req, res) {
  var uTitle = req.body.uTitle;
  var uEmail = req.body.uEmail;
  var uBoard = req.body.uBoard;
  var uSendToList = req.body.sendList;

  user.queryById(res.locals.user._id, function(err, u) {
    if (err) 
      return next(err);
    if (checkAgain(uTitle))
      u.setting.myTitle = uTitle
    if (checkAgain(uEmail))
      u.setting.myEmail = uEmail
    if (checkAgain(uBoard))
      u.setting.outputBoard = uBoard
    if (checkAgain(uSendToList))
      u.setting.sendToGroup = uSendToList
    
    u.save(function() {
      res.json({
        stat: 'ok',
        msg: '设置已更新'
      });
    });
  });
};

function checkAgain(e) {
  return (e != '');
}
