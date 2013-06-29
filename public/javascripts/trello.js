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
			console.log(data);
			console.log(Trello.token());
			$.post("/mime/saveToken", {
				token: Trello.token()
			}, function(data) {
				if(data.stat == 'ok') {
					title.text('已成功绑定trello账户：' + data.user + '。正在跳转...')
					btn.text('授权成功！');
					btn.css('background-color','#27AE60');
					window.location.href = "/";
				};
			});
		})
	});
});