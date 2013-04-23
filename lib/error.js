var colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

// error handler
var text = {
	db : '数据库开小差啦，稍等片刻再试试，或者去找管理员 新浪微博@郭宇 投诉去！',
	wb : '╮(╯▽╰)╭ 公测还没开放哦，再等几天吧少年，公司的事情实在是太忙了，你有时间的话，也可以来找我 （新浪微博@郭宇） 吐槽....',
	wx : '微信服务器好像出了点问题，不过不要捉急，去找 新浪微博@郭宇 投诉去！',
	nf : '好像哪里不对啊，这个页面是不存在的。你怎么找来了？快说！！'
}

module.exports = function(type) {
	console.log(text[type].error);
	return text[type];
}