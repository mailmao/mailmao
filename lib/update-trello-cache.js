var async = require('async'),
	dbModel = require('../models.js'),
	trello = require('../lib/config.js')('trello'),
	mdparser = require('../lib/markdown-parser.js'),
	user = dbModel.user,
	errHandler = require('../lib/error.js'),
	api = require('./api.js');

// 更新trello缓存
module.exports = function(boardID,trelloToken, done) {

	async.waterfall([
	  function(callback){

  		api('GET', 'https://api.trello.com/1/boards/' + boardID + '/lists?cards=open&card_fields=name,badges,labels,desc,idMembers,checkItemStates,idChecklists&card_attachments=true&card_attachment_fields=name,date,bytes,previews,url&fields=name&key='+trello.key+'&token=' + trelloToken, function(cards){
  			var c = mdparser(cards,'html');
  			callback(null, c);
  		});
	      
	  },
	  function(cards, callback){

	  	api('GET', 'https://api.trello.com/1/boards/' + boardID + '/members?fields=avatarHash,fullName,url&key='+trello.key+'&token=' + trelloToken, function(members){
	  		callback(null, cards, members);
	  	});
	     
	  },
	  function(cards, members, callback){

	  	api('GET', 'https://api.trello.com/1/boards/' + boardID + '/checklists?&key='+trello.key+'&token=' + trelloToken, function(checkLists) {
	  		callback(null, cards, members , checkLists);
	  	});

	  },
	  function(cards, members , checkLists ,callback) {

	  	api('GET', 'https://api.trello.com/1/boards/' + boardID + '/?cards=open&card_fields=name,idList&card_attachments=true&card_attachment_fields=name,date,bytes,previews,url&fields=name&key='+trello.key+'&token=' + trelloToken, function(attrs){
	  		callback(null, cards, members , checkLists , attrs ,callback);
	  	});

	  },
	  function(cards, members , checkLists , attrs ,callback) {
	  	var trelloCache = {
	  		cards: cards,
	  		members: members,
	  		checkLists: checkLists,
	  		attrs: attrs
	  	}
	  	done(trelloCache);
	  }
	]);
}