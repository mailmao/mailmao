// trello settings
$(document).ready(function() {
	var requestToken = function(callback) {
			Trello.authorize({
				type: "popup",
				persist: true,
				expiration: "never",
				name: "邮差猫 Mailmao.com",
				success: function() {
					callback(Trello.token())
				}
			});
		}
	$('#vTrello').click(function() {
		var btn = $(this);
		var title = $(this).parents('.trello').find('h3.title');
		$(this).text('正在授权...')
		requestToken(function(data) {
			$.post("/mime/update/token", {
				token: Trello.token()
			}, function(data) {
				if(data.stat == 'ok') {
					title.text('已成功绑定trello账户：' + data.user + '。正在获取内容，请稍等...')
					btn.text('授权成功！');
					btn.css('background-color','#27AE60');
					window.location.href = "/";
				};
			});
		})
	});
});