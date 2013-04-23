// 当用户确认订阅的时候发送邮件到订阅邮箱
var md5 = require('../lib/md5.js'),
	async = require('async'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	client = dbModel.client,
	errHandler = require('../lib/error.js'),
	nodemailer = require("nodemailer"),
	sender = require('../lib/config.js')('smtp');

var smtpTransport = nodemailer.createTransport("SMTP", {
	host: sender.server,
	port: sender.port,
	use_authentication: sender.useAuth,
	auth: {
		user: sender.email,
		pass: sender.password
	}
});

module.exports = function(req, res, next) {

	var email = req.params.email;
	var uid = req.params.uid;

	async.waterfall([

	function(callback) {
		client.findOne({
			email: email
		}).exec(function(err, doc) {
			if(!err) {
				if(doc == null) {
					var d = new Date();
					// 没有这个订阅用户
					var newClient = new client({
						email: email,
						pin: md5(email + d.toString())
					});
					newClient.save(function(err) {
						if(!err) {
							callback(null, newClient.pin);
						} else {
							res.send(errHandler('db'))
						}
					})
				} else {
					callback(null, doc.pin);
				}
			} else {
				res.send(errHandler('db'))
			}
		})
	}, function(pin, callback) {
		user.findById(uid).exec(function(err,doc){
			if (!err) {
				if (doc) {
					callback(null,pin,doc);
				} else {
					res.send('没有找到这个频道')
				}
			}
		})
	}, function(pin,user, callback) {

		var name = user.weibo.info.screen_name;
		var board = user.setting.outputBoard.name;

		var mailOptions = {
			from: sender.from,
			to: email,
			subject: '请您确认订阅 - 邮差猫',
			text: '您正在申请订阅' + name + '的频道：《' + board + '》，确认订阅请点击或者复制以下链接访问\n' + 'http://mailmao.com/' + uid + '/subscribe/' + email + '/check?confirm=' + pin + '\n' + '如果申请订阅不是您的操作，请忽略此邮件。' 
		}

		smtpTransport.sendMail(mailOptions, function(error, response) {
			if(error) {
				res.send('确认邮件发送失败，请稍后再试试订阅这个频道。')
			} else {
				res.send('确认邮件已发送，请前往邮箱点击链接确认')
			}
			smtpTransport.close();
		});
	}
	]);
}