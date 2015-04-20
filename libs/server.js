var path = require('path');
var debug = require('debug');
var logger = require("morgan");
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var pkg = require('../package.json');

module.exports = Server;

function Server(configs) {
  this.configs = configs || {};

  // Init the app instance.
  var app = express();
  var env = process.env.NODE_ENV || 'development';
  var devMode = !(env === 'production');
  var logstyle = devMode ? 'dev' : 'common';

  // Environment Vars
  app.set('env', env);
  app.set('port', process.env.PORT || 3000);

  // Middlewares
  app.use(logger(logstyle));
  app.use(compress());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Inject App locals
  app.locals.uri = devMode ? 
    'http://127.0.0.1:' + app.get('port') : 
    this.configs.uri;

  app.locals.system = pkg;

  this.app = app;

  return this;
}

Server.prototype.routes = function(routes) {
  routes(this.app);
  return this;
};

Server.prototype.run = function() {
  var app = this.app;
  var log = debug(pkg.name);

  log('URI=%s', app.locals.uri);
  log('NODE_ENV=%s', app.get('env'));
  log('PORT=%s', app.get('port'));

  // Start this app instance
  app.listen(app.get('port'));
};
