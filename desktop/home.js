// 使用别名(alias)加载组件
$(document).ready(function() {
	$("#main").load(function(){ 
		$('h3.loading-title').fadeOut(100);
        $("body").removeClass("loading");
        $('#main').fadeIn(1200)
    }); 
});