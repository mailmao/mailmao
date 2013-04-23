// var async = require('async'),
// 	dbModel = require('../models.js'),
// 	user = dbModel.user,
// 	errHandler = require('../lib/error.js'),
// 	exec = require('child_process').exec;

// // 保存生成文章页面的静态资源库
// var staticCave = new UPYun('atp-posts', 'atp-post-admin', 'turingou2011');

// module.exports =  function(req, res, next) {
// 	if(req.session.uid) {
// 		var cardID = req.body.thisID;
// 		var cardListID = req.body.thisListID;
// 		res.locals.cardID = cardID;
// 		res.locals.cardListID = cardListID;
// 		// 查询当前卡片md信息
// 		allUser.findOne({
// 			id: req.session.user.id
// 		}).exec(function(err, doc) {
// 			if(!err) {
// 				var thisUserLists = doc.cache.cards;
// 				for(var i = 0; i < thisUserLists.length; i++) {
// 					if(thisUserLists[i].id == cardListID) {
// 						for(var j = 0; j < thisUserLists[i].cards.length; j++) {
// 							if(thisUserLists[i].cards[j].id == cardID) {
// 								var thisCardName = thisUserLists[i].cards[j].name;
// 								var thisCardMd = thisUserLists[i].cards[j].desc;
// 								var thisCardMember = thisUserLists[i].cards[j].idMembers;
// 								var thisCardLabel = thisUserLists[i].cards[j].labels;
// 								res.locals.thisCardName = thisCardName;
// 								res.locals.thisCardMd = thisCardMd;
// 								res.locals.thisCardMember = thisCardMember;
// 								res.locals.thisCardLabel = thisCardLabel;
// 								next();
// 							}
// 						};
// 					}
// 				};
// 			}
// 		})
// 	} else {
// 		res.json({
// 			stat: 'error',
// 			msg: 'not signined'
// 		})
// 	}
// }, function(req, res, next) {
// 	// 查询当前卡片附件
// 	allUser.findOne({
// 		id: req.session.user.id
// 	}).exec(function(err, doc) {
// 		if(!err) {
// 			var thisListAttr = doc.cache.attrs.cards;
// 			for(var i = 0; i < thisListAttr.length; i++) {
// 				if(thisListAttr[i].id == res.locals.cardID && thisListAttr[i].idList == res.locals.cardListID) {
// 					var thisCardAttr = thisListAttr[i].attachments;
// 					res.locals.thisCardAttar = thisCardAttr;
// 					next();
// 				}
// 			};
// 		}
// 	});
// }, function(req, res, next) {
// 	// 拼接新的md
// 	var thisTime = new Date().toISOString();
// 	var cardTag = res.locals.thisCardLabel;
// 	// 筛选出标签名字
// 	var cardTagName = [];
// 	for(var i = 0; i < cardTag.length; i++) {
// 		cardTagName.push(cardTag[i].name);
// 	};
// 	// 筛选缩略图
// 	var thisAttrPreview = '';
// 	console.log(res.locals.thisCardAttar);
// 	if(res.locals.thisCardAttar.length == 1) {
// 		for(var i = 0; i < res.locals.thisCardAttar[0].previews.length; i++) {
// 			if(res.locals.thisCardAttar[0].previews[i].width == '276') {
// 				thisAttrPreview = res.locals.thisCardAttar[0].previews[i].url;
// 			}
// 		};
// 	}
// 	// 制造空壳md
// 	var mdCard = ['# ' + res.locals.thisCardName, '', '- pubdate: ' + thisTime, '- tags: ' + cardTagName.toString(), '- description: ' + thisAttrPreview, '', '--------', (thisAttrPreview == '' ? '' : '![](' + thisAttrPreview + ')'), res.locals.thisCardMd].join('\n');
// 	// 保存md
// 	fs.writeFile('./cardsHtml/content/' + res.locals.thisCardName + '.md', mdCard, function(err) {
// 		if(!err) {
// 			// 执行build命令
// 			exec('nico build', {
// 				cwd: './cardsHtml'
// 			}, function(err, stdout, stderr) {
// 				if(!err) {
// 					next();
// 				}
// 			})
// 		}
// 	});
// }, function(req, res, next) {

// 	var fileName = res.locals.thisCardName.toLowerCase();
// 	fileName = fileName.split(' ').join('-');
// 	console.log(fileName)

// 	// 将生成的HTML文件传送到youpai
// 	fileName = fileName + '.html';
// 	var fileContent = fs.readFileSync('./cardsHtml/_site/' + fileName);
// 	var md5Str = MM.func.md5(fileContent);

// 	staticCave.setContentMD5(md5Str);
// 	staticCave.setFileSecret('bac');
// 	staticCave.writeFile('/posts/' + fileName, fileContent, false, function(err, data) {
// 		if(!err) {
// 			res.locals.fileName = fileName;
// 			next()
// 		}
// 	});

// }, function(req, res, next) {

// 	// 同步index
// 	var index = fs.readFileSync('./cardsHtml/_site/index.html');
// 	var md5Str = MM.func.md5(index);

// 	staticCave.setContentMD5(md5Str);
// 	staticCave.setFileSecret('bac');
// 	staticCave.writeFile('/posts/index.html', index, false, function(err, data) {
// 		if(!err) {
// 			next()
// 		}
// 	});

// }, function(req, res, next) {

// 	// 同步feed
// 	var feed = fs.readFileSync('./cardsHtml/_site/feed.xml');
// 	var md5Str = MM.func.md5(feed);

// 	staticCave.setContentMD5(md5Str);
// 	staticCave.setFileSecret('bac');
// 	staticCave.writeFile('/posts/feed.xml', feed, false, function(err, data) {
// 		if(!err) {
// 			res.json({
// 				stat: 'ok',
// 				msg: '静态文件库已经更新完成，当前页面地址是：' + atpPostCave + '/posts/' + res.locals.fileName
// 			})
// 		}
// 	});
// }