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
	           	$('.mime-right').prepend('<div class="alert alert-success">'+ data.msg +'<button type="button" class="close" data-dismiss="alert">×</button></div>')
	          });
	        }
	      });
	    }
	$('#vTrello').click(requestToken);
	// add more send-to-list
	$('.send-to-list .add-one').click(function(){
		var $listInput = '<input type="text" class="add-on-list input-medium" />'
		$(this).parents('.send-to-list').append($listInput);
	});
	// save my new settings
	$('#saveSettings').click(function () {
		// prepare send to list
		var sendToList = [];
		$('.send-to-list input').each(function () {
			// body...
			sendToList.push($(this).val());
		});
		// post info to server
		$.post("/mime/saveSetting", {
			uTitle : $('#mimeTitle').val(),
			uEmail : $('#mimeEmail').val(),
			uImg : $('#mimeImg').val(),
			sendList : sendToList
		},function(data){
			alert(data.msg)
		});
	});
	// mail setting tab
	$('.input-data a').hover(function () {
		var thisClass = $(this).attr("class");
		switch (thisClass) {
			case 'post-layout':  $('.hidden-layout').show().siblings('.tool-box').hide();
			break
			case 'post-title':  $('.hidden-title').show().siblings('.tool-box').hide();
			break
			case 'bgimg':  $('.hidden-img').show().siblings('.tool-box').hide();
			break
			case 'post-date':  $('.hidden-date').show().siblings('.tool-box').hide();
			break
		}
		$('.hidden-tools').show();
	},function () {
		//$('.hidden-tools').hide();
	});
	$('.close-hidden a').click(function(){
		$(this).parents('.hidden-tools').hide();
	});
 	// date setting
	$('.datepicker-trigger').datepicker({format:'yyyy/mm/dd'}).on('changeDate', function(ev){
	    // dosth;
	    console.log(ev.date);
	});
	// send mail function
	$('.send').click(function () {
		$(this).text('').addClass('loading');
		$.post("/send",{ postTitle: $('#postTitle').val(), bgIMG: $('#postImg').val() , postDate: $('#postDate').val() },function(data) {
			if (data.msg == 'ok') {
				$('.send').removeClass('loading').html('<i class="icon-ok"></i> 成功').addClass('send-sus');
			}
		});
	});
});