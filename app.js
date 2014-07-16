//                     _ __                    
//    ____ ___  ____ _(_) /___ ___  ____ _____ 
//   / __ `__ \/ __ `/ / / __ `__ \/ __ `/ __ \
//  / / / / / / /_/ / / / / / / / / /_/ / /_/ /
// /_/ /_/ /_/\__,_/_/_/_/ /_/ /_/\__,_/\____/ 
// 
// @author: [turingou](http://guoyu.me)
// @description : Mail pusher based on Trello/Express/Nodemailer

exports.server = Server;

function Server(params) {
  var express = require('express');
  var path = require('path');
  var MongoStore = require('connect-mongo')(express);
  var pkg = require('./pkg');
  var sys = require('./package.json');
  var self = this;

  var app = express();
  var MemStore = express.session.MemoryStore;

  pkg.set('/database.json', params.database);

  var home = require('./routes/index'),
    sign = require('./routes/sign'),
    about = require('./routes/about'),
    trello = require('./routes/trello'),
    user = require('./routes/user'),
    cn = require('./lib/zh-cn'),
    moment = require('moment'),
    errhandler = require('./lib/error'),
    duoshuo = require('./routes/duoshuo');

  var apis = {
    update: require('./routes/update'),
    send: require('./routes/send'),
    upload: require('./routes/upload'),
    setting: require('./routes/setting'),
    token: require('./routes/token')
  };

  app.set('env', params.env ? params.env : 'development');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.limit('20mb'));
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: path.join(__dirname, '/uploads')
  }));
  app.use(express.methodOverride());
  app.use(express.cookieParser(params.database.name));
  app.use(express.session({
    secret: params.database.name,
    store: new MongoStore({
      db: params.database.name,
      collection: 'sessions'
    })
  }));
  app.use(function(req, res, next) {
    if (!res.locals.Server) {
      res.locals.Server = self;
    }
    next();
  });
  app.use(require('less-middleware')({
    src: __dirname + '/public'
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);

  // errhandler
  app.use(errhandler.logger);
  app.use(errhandler.xhr);
  app.use(errhandler.common);

  moment.lang('zh-cn', cn);
  app.get('*', function(req, res, next) {
    res.locals.moment = moment;
    next();
  });

  app.locals.sys = sys;
  app.locals.site = params;

  // pages
  app.get('/', sign.passport, home);
  app.get('/signin', sign.signin);
  app.get('/signout', sign.signout);
  app.get('/about', sign.passport, about);
  app.get('/sync', sign.check, duoshuo.page);
  app.get('/trello', sign.check, trello);
  app.get('/mime', sign.check, user.home);
  app.get('/mime/update', sign.check, user.update);

  // apis
  app.post('/update', sign.checkJSON, apis.update);
  app.post('/send', sign.checkJSON, apis.send);
  app.post('/upload', sign.checkJSON, apis.upload);
  app.post('/sync', sign.check, duoshuo.sync);
  app.post('/mime/update', sign.checkJSON, apis.setting); // saveSetting
  app.post('/mime/update/token', sign.checkJSON, apis.token); // savetoken

  this.app = app;
  this.params = params;
}

Server.prototype.run = function(port) {
  var self = this;
  var http = require('http');
  var app = self.app;
  app.set('port', (port && !isNaN(parseInt(port))) ? parseInt(port) : 3000);
  app.locals.href = (app.get('env') == 'development') ? 'http://localhost:' + app.get('port') : app.locals.site.url;
  http.createServer(app).listen(app.get('port'));
}
