$(document).ready(function() {
	// trello settings
	var requestToken = function(){
	      Trello.authorize({
	        type: "popup",
	        persist: true,
	        expiration: "never",
	        name: "Mailmao.com",
	        success: function(){
	         console.log(Trello.token());
	          $.post("/mime/saveToken", { token: Trello.token() },
	          function(data) {
	           	if (data.stat == 'ok') {
	           		alert(data.msg);
	           		location.href = "/mime/update";
	           	};
	          });
	        }
	      });
	    }
	$('#vTrello').click(requestToken);
	// add more send-to-list
	$('.send-to-list .add-one').click(function(){
		var $listInput = '<div class="input-append"><input type="text" class="add-on-list input-large" placeholder="输入邮箱地址" /><a href="javascript:void(0);" class="remove-one btn"><i class="icon-remove"></i></a></div>'
		$(this).parents('.send-to-list').append($listInput);
	});
	$('.send-to-list .remove-one').live('click',function(){
		$(this).parent().remove();
	});
	// select boards
	$('.boards a').click(function(){
		$(this).parent().siblings().removeClass('cur-board');
		$(this).parent().addClass('cur-board');
	});
	// check and post
	var check = function(e) {
	 	if ($(e).val() == '') {
			return false;
		} else {
			return true;
		};
	}
	var checkList = function(e) {
	 	if (!e.length) {
	 		return false
	 	} else {
	 		return true
	 	}
	}
	var checkBoard = function(e) {
		if (e.name == '' || e.id == '') {
	 		return false
	 	} else {
	 		return true
	 	};
	}
	// save my new settings
	$('#saveProfile').click(function () {
		// prepare send to list
		var sendtolist = [];
		$('.send-to-list input').each(function () {
			sendtolist.push($(this).val());
		});
		// prepare boards info 
		var uboard = {
			name : $('.cur-board a').text(),
			id : $('.cur-board').attr('board-id')
		};
		// post info to server
		$.post("/mime/saveSetting", {
			uTitle : check('#mimeTitle') ? $('#mimeTitle').val() : '',
			uEmail : check('#mimeEmail') ? $('#mimeEmail').val() : '',
			sendList : checkList(sendtolist) ? sendtolist : '',
			uBoard : checkBoard(uboard) ? uboard : ''
		},function(data){
			alert(data.msg);
			location.href = "/mime";
		});
	});
});