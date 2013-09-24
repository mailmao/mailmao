// SMTP sendMail

var nodemailer = require("nodemailer"),
    jade = require('jade'),
    fs = require('fs'),
    moment = require('moment'),
    zh = require('../lib/zh-cn.js');

moment.lang('zh-cn',zh);

module.exports = function(tpl, params, callback) {
    
    var sender = params.sender,
        tplcontent = fs.readFileSync('./views/templates/' + tpl, 'utf8'),
        jadeCompile = jade.compile(tplcontent),
        vars = params.mail;

    // send mail
    // var fnhtml = jadeFn({
    //     title: sendInfo.title,
    //     date: d,
    //     bg: sendInfo.bg,
    //     lists: sendInfo.cnt.cards ? sendInfo.cnt.cards : '',
    //     members: sendInfo.cnt.members ? sendInfo.cnt.members : '',
    //     checkLists: sendInfo.cnt.checkLists ? sendInfo.cnt.checkLists : '',
    //     attrFile: sendInfo.cnt.attrs.cards ? sendInfo.cnt.attrs.cards : '',
    //     cnt: sendInfo.cnt,
    //     user : sendInfo.user,
    //     uid: sendInfo._id,
    //     version: '0.9'
    // });

    if(!sender.server){
        callback(new Error('email sender server required!'));
    };

    // smtp config
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: sender.server,
        port: sender.port,
        use_authentication: sender.useAuth,
        auth: {
            user: sender.email,
            pass: sender.password
        }
    });

    vars.date = moment().format('LL');
    // send mail
    smtpTransport.sendMail({
        from: sender.from,
        to: vars.list,
        subject: vars.sub,
        html: jadeCompile(vars)
    }, function(error, response) {
        callback(error, response);
        smtpTransport.close();
    });
};