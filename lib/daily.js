// sync alipay-daily
var request = require('request');

var po = function(path, form ,cb) {
  request({
    method: 'POST',
    url: path,
    form: form,
    json: true
  }, function(e, r, body) {
    if(!e){
      cb(body);
    } else {
      cb('error')
    }
  });
}

// var server = 'http://devtool10.p1.alipay.net/personal/reportTaskOfWeek.json?action=saveOneTaskWithWorkload&nocache=';

var server = 'http://devtool10.p1.alipay.net/personal/reportTaskOfWeek.json?action=saveOneTaskWithWorkload';

$.ajax({
  type: 'POST',
  url: server,
  data: form,
  dataType: 'jsonp'
}).done(function(d) {
  console.log(d)
});

$.ajax({
  type: 'POSt',
  url: 'http://guoyu/me',
  dataType: 'jsonp'
}).done(function(d) {
  console.log(d)
});

var form = {
	startDate: '2013-04-08',
	endDate: '2013-04-14',
	loginKey: true,
	loginName: 'yu.gy',
	task: {
		title: '公共研发',
		startDate: '2013-04-08',
		endDate: '2013-04-14',
		taskType: '产品技术文档',
		login_name: '',
		workload: 1,
		taskTypeId: 83,
		taskSubtypeId: 56,
		missionId: 0,
		projectId: 11,
		taskSubtype: '',
		deleted: '0',
		content: 'sharely分享组件开发'
	}
}

module.exports = function(cnt,callback) {
	var d = new Date();
	var f = _.clone(form);
	f.task.content = cnt;
	po('POST',server + d.toString(),f,function(data){
		console.log(data);
		if (data.result.resultCode === 'OK') {
			callback('ok')
		}
	})
}