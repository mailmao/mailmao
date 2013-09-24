var updateBoard = function(bid, callback) {
		$.post("/update", {
			bid: bid
		}, function(data) {
			if(data.stat == 'ok') {
				callback()
			} else {
				alert(data.msg)
			}
		});
	}

var checkEmail = function(email) {
		var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return re.test(email);
	}

var bindUpload = function(target) {
	$(target).fileupload({
	    dataType: 'json',
	    add: function (e, data) {
	    	
	        data.context = $('<div class="single-upload clearfix"><span class="file-name">' + data.files[0].name + '</span><a class="upload-now" href="javascript:void(0);">现在上传</a><a class="delete-single" href="javascript:void(0);">取消</a></div>')
	            .appendTo($('#upload-file-list'))
	            .click(function (e) {

	            	var target = e.target;

	            	if (target.className == 'upload-now') {

	            		$('#progress .bar').css(
				            'width',
				            '0%'
				        );

				        $(target).next('a.delete-single').remove();

		                data.submit();

	            	} else if (target.className == 'delete-single') {
	            		removeImg(target);
	            	} else if (target.className == 'uploaded-img'){
	            		$('#cke_46_textInput').val($(target).attr('src'))
	            	} else {
	            		return false;
	            	}

	            	e.stopPropagation();
	                
	            });
	    },
	    progressall: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        $('#progress .bar').css(
	            'width',
	            progress + '%'
	        );
	    },
	    done: function (e, data) {
	        if (data.result.stat == 'ok') {
	        	data.context.find('.upload-now').replaceWith($('<span class="upload-success" data-url="http://' + data.result.url + '"/>').text('上传成功'));
	        	data.context.find('.file-name').replaceWith($('<img class="uploaded-img" src="' + data.result.url + '_300"/>'));
	        	$('#sendBg').attr('src',data.result.url + '_660')
	        } else {
	        	alert(data.result.msg)
	        }
	    }
	});
}

var removeImg = function(target) {
	$(target).parents('.single-upload').fadeOut(500,function(){
		$(this).remove()
	})
}

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

$(document).ready(function() {

	if (window.localStorage) {
		var localContact = JSON.parse(localStorage.getItem('mailmao_contact'));
	}

	var mails = $('#sendToList').magicSuggest({
		resultAsString: true,
		width: 700,
		emptyText: '输入一个邮件地址，回车添加。',
		maxSelection: 100,
		noSuggestionText: '找不到匹配的邮件地址',
		typeDelay: 50,
		toggleOnClick: true,
		data: localContact ? localContact : []
	});

	// 校验邮件合法
	$(mails).on('selectionchange', function(a, b, emails) {
		if(emails.length > 0) {
			var last = emails[emails.length - 1];
			if(!checkEmail(last.name)) {
				alert('请输入有效的email地址');
				mails.removeFromSelection(last, true);
			}
		}
	})

	// 邮件内部工具栏
	$('#sendTitle .title').popover({
		placement: 'bottom',
		title: '修改周报标题',
		content: '<input type="text" id="postTitle" class="setting-change" placeholder="' + $('#sendTitle .title').text() + '" />'
	});
	$('#sendBg').popover({
		placement: 'top',
		title: '修改周报背景',
		html: true,
		content: '<input type="text" id="postImg" class="setting-change" placeholder="输入新的背景图片url(660x200)" /><div id="uploadBox" class="clearfix"><span class="upload-wrap"><i class="icon-upload"></i>选择电脑中的本地图片上传<input id="fileupload" type="file" name="uploadedImg" data-url="/upload"></span><div id="upload-file-list" class="clearfix"></div><div id="progress"><div class="bar" style="width: 0%;"></div></div></div>'
	});
	$('#postTitle').live('keyup', function() {
		$('#sendTitle span.title').text($(this).val());
	});
	$('#postImg').live('keyup', function() {
		$('#sendBg').attr('src', $(this).val());
	});

	// 切换输出板块
	$('a.select-boards').click(function() {
		var bid = $(this).attr('data-id');
		$(this).find('i').removeClass().addClass('icon-spinner icon-spin');
		$(this).find('span').text('正在更新，稍安勿躁...');
		updateBoard(bid, function(data) {
			window.location.reload();
		})
	});

	// 更新缓存
	$('#updateCache').click(function() {
		$(this).find('span').text('正在更新');
		$(this).find('i').addClass('icon-spin');
		updateBoard(null, function(data) {
			location.reload();
		});
	});

	// 发送邮件
	$('.send').click(function() {
		$(this).empty().addClass('loading');
		if (window.localStorage) {
			var list = [];
			var cur = mails.getValue();
			var old = JSON.parse(localStorage.getItem('mailmao_contact'));
			if (old != null) {
				list = old.concat(cur)
			} else {
				list = cur;
			}
			localStorage.setItem('mailmao_contact',JSON.stringify(list));
		}
		// 准备发送列表
		$.post("/send", {
			postTitle: $('#sendTitle span.title').text(),
			bgIMG: $('#sendBg').attr('src'),
			sendToList: mails.getValue()
		}, function(data) {
			if(data.stat == 'ok') {
				$('.send').removeClass('loading').html('<i class="icon-ok"></i> 发送成功').addClass('btn-success disabled');
			}
		});
	});

	$('#sendBg').on('click',function(){
		bindUpload($('#fileupload'));
	});

	$('a.update-trello').click(function() {
		var btn = $(this);
		$(this).text('正在更新...')
		requestToken(function(data) {
			$.post("/mime/update/token", {
				token: Trello.token()
			}, function(data) {
				if(data.stat == 'ok') {
					btn.text('更新成功！');
					window.location.reload();
				};
			});
		})
	});
});