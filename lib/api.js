/**
*
* 获得第三方API提供的数据
* @param {[string]} [method] [请求方法]
* @param {[string]} [path] [请求URL]
* @param {[function]} [next] [回掉函数]
*
**/

var request = require('request');

module.exports = function( method, path, cb) {
  request({
    method: method,
    url: path,
    json: true
  }, function(e, r, body) {
    if(!e){
      cb(body);
    } else {
      cb('error')
    }
  });
}