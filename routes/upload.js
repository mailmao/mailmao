var UPYun = require('upyun').UPYun,
	md5 = require('md5'),
	dbModel = require('../models.js'),
	user = dbModel.user,
	fs = require('fs'),
	upyunInfo = require('../lib/config.js')('upyun');

var upyun = new UPYun(upyunInfo.cave, upyunInfo.user, upyunInfo.password);
var cave = upyunInfo.baseUrl;

module.exports = function(req, res) {

  if (req.session.uid) {
	var fileContent = fs.readFileSync(req.files.uploadedImg.path);
	var fileName = req.files.uploadedImg.name;
	var md5Str = md5(fileContent);
	var link = req.session.uid + '-' + md5(req.files.uploadedImg.name) + '.png';
	upyun.setContentMD5(md5Str);
	upyun.setFileSecret('bac');
	upyun.writeFile('/banners/' + link, fileContent, false, function(err, data) {
		if(!err) {
			user.findById(req.session.uid).exec(function(err, doc) {
				doc.setting.banner = encodeURI(cave + link);
				doc.save(function() {
					res.json({
				        stat:'ok',
				        msg: '同步成功!',
				        url: cave + link
				  	});
				});
			});
		} else {
			res.json({
				stat: 'error'
			});
		}
	});
  } else {
  	res.json({
		stat: 'error',
		msg: '请先登录'
	});
  }
}