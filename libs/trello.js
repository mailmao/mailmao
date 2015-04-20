var async = require('async');
var api = require('beer');
var md = require('./parser');

// 还不够原子化
// update cacahe
exports.updateCache = function(params, callback) {
  if (!params) return callback(new Error('params required'));
  var bid = params.bid;
  var token = params.token;
  var key = params.key;
  async.parallel({
    cards: function(callback) {
      api.get('https://api.trello.com/1/boards/' + bid + '/lists', {
        query: {
          cards: 'open',
          card_fields: 'name,badges,labels,desc,idMembers,checkItemStates,idChecklists',
          card_attachments: 'true',
          card_attachment_fields: 'name,date,bytes,previews,url',
          fields: 'name',
          key: key,
          token: token
        }
      }, function(err, result) {
        callback(err, md(result.body));
      });
    },
    members: function(callback) {
      api.get('https://api.trello.com/1/boards/' + bid + '/members', {
        query: {
          fields: 'avatarHash,fullName,url',
          key: key,
          token: token
        }
      }, function(err, result) {
        callback(err, result.body);
      });
    },
    checkLists: function(callback) {
      api.get('https://api.trello.com/1/boards/' + bid + '/checklists', {
        query: {
          key: key,
          token: token
        }
      }, function(err, result) {
        callback(err, result.body);
      });
    },
    attrs: function(callback) {
      api.get('https://api.trello.com/1/boards/' + bid, {
        query: {
          cards: 'open',
          card_fields: 'name,idList',
          card_attachments: 'true',
          card_attachment_fields: 'name,date,bytes,previews,url',
          fields: 'name',
          key: key,
          token: token
        }
      }, function(err, result) {
        callback(err, result.body);
      });
    }
  }, callback);
}

// update info and boardList
exports.updateInfo = function(params, callback) {
  if (!params) return callback(new Error('params required'));
  var token = params.token;
  var key = params.key;
  async.waterfall([
    function(callback) {
      api.get('https://api.trello.com/1/tokens/' + token + '/member', {
        query: {
          key: key
        }
      }, function(err, result) {
        callback(err, result.body);
      });
    },
    function(info, callback) {
      api.get('https://api.trello.com/1/members/' + info.id + '/boards', {
        query: {
          key: key,
          filter: 'open',
          fields: 'name',
          token: token
        }
      }, function(err, result) {
        callback(err, info, result.body);
      });
    },
  ], callback);
};