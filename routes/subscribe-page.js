// subscribe-page.js
var async = require('async'),
  dbModel = require('../models.js'),
  user = dbModel.user,
  client = dbModel.client,
  errHandler = require('../lib/error.js');

module.exports = function(req, res, next) {
  var uid = req.params.uid;
  user.findById(uid).exec(function(err, doc) {
    if(!err) {
      res.render('subscribe', {
        user: doc
      })
    } else {
      res.send(errHandler('db'))
    }
  })
}