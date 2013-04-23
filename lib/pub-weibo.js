// 在用户注册时发表新微博
var pubWb = function(token, pushCnt, next) {
		request.post({
			url: 'https://api.weibo.com/2/statuses/update.json?access_token=' + token,
			form: {
				status: pushCnt
			}
		}, function(e, r, body) {
			if(e) {
				console.log(e);
			} else {
				console.log(body);
				next();
			}
		});
	}
module.exports = pubWb;