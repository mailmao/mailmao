// SMTP sendMail
var nodemailer = require("nodemailer"),
	jade = require('jade'),
	fs = require('fs'),
	moment = require('moment'),
	zh = require('./zh-cn.js'),
	child_process = require('child_process'),
	sender = require('../lib/config.js')('smtp');

moment.lang('zh-cn',zh);

var sendMail = function(sendInfo,callback) {
	
	var mailTpl = fs.readFileSync('./views/emailTpl/' + sendInfo.tpl + '.jade', 'utf8');
	var jadeFn = jade.compile(mailTpl);
	var d = moment().format('LL');
	
	// send mail
	var fnhtml = jadeFn({
		title: sendInfo.title,
		date: d,
		bg: sendInfo.bg,
		lists: sendInfo.cnt.cards ? sendInfo.cnt.cards : '',
		members: sendInfo.cnt.members ? sendInfo.cnt.members : '',
		checkLists: sendInfo.cnt.checkLists ? sendInfo.cnt.checkLists : '',
		attrFile: sendInfo.cnt.attrs.cards ? sendInfo.cnt.attrs.cards : '',
		cnt: sendInfo.cnt,
		user : sendInfo.user,
		uid: sendInfo._id,
		version: '0.9'
	});
	if(!sender.server){
		console.log(process.server)
		return callback()
	}

	// qq smtp
	var smtpTransport = nodemailer.createTransport("SMTP", {
		host: sender.server,
		port: sender.port,
		use_authentication: sender.useAuth,
		auth: {
			user: sender.email,
			pass: sender.password
		}
	});

	var mailOptions = {
		from: sender.from,
		to: sendInfo.list,
		subject: sendInfo.sub,
		html: fnhtml
	}

	smtpTransport.sendMail(mailOptions, function(error, response) {
		if(error) {
			callback(error,'error');
		} else {
			callback(null,response);
		}
		smtpTransport.close();
	});
}

module.exports = sendMail;