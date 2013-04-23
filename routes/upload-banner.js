// upload
module.exports = function(req,res,next){

  if (req.files.uploadedImg) {

    var path = req.files.uploadedImg.path;
    var uploadedName = path.substr(path.indexOf('/uploads'));
    var host = req.headers.host;
    uploadedName = host + uploadedName;

    if (app.locals.config.upyun) {

      // 如果配置了upyun，则同步博客文章到空间里。
      res.locals.fileName = uploadedName;
        
          var MimeUpyun = app.locals.config.upyun;

		  var caveInfo = connectSysc(MimeUpyun);
		  var staticCaveUrl = cave.url;
		  var cave = cave.info;

		  var fileName = res.locals.fileName;

		  // 将图片同步到cdn
		  sync(cave,'../uploads/',fileName,'/uploads',function(upyunData){
		  	res.json({
		        stat:'ok',
		        msg: '同步成功!',
		        cdnUrl: staticCaveUrl + fileName
		  	});
		  });

    } else {

      var url = uploadedName;

      res.json({
        stat:'ok',
        msg: '上传成功!',
        url: url
      });

    }

  } else {
    res.json({
      stat:'error',
      msg: '上传失败'
    });
  }

}