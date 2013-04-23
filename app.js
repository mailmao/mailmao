//                     _ __                    
//    ____ ___  ____ _(_) /___ ___  ____ _____ 
//   / __ `__ \/ __ `/ / / __ `__ \/ __ `/ __ \
//  / / / / / / /_/ / / / / / / / / /_/ / /_/ /
// /_/ /_/ /_/\__,_/_/_/_/ /_/ /_/\__,_/\____/ 

/**
 *
 * @author: yu.gy
 * @version [1.5]
 * @description : 从此爱上写周报
 *
 **/

var express = require('express'),
	http = require('http'),
	https = require('https'),
	fs = require('fs'),
	path = require('path'),
	MongoStore = require('connect-mongo')(express);

var app = express();
var MemStore = express.session.MemoryStore;

app.configure(function() {
	app.set('port', process.env.PORT || 8080);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser({
		keepExtensions: true,
		uploadDir: path.join(__dirname, '/uploads')
	}));
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session({
		secret: 'mailmao',
		store: new MongoStore({
			db: 'mailmao',
			collection: 'sessions'
		})
	}));
	app.use(app.router);
	app.use(require('less-middleware')({
		src: __dirname + '/public'
	}));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

var _config = require('./lib/config.js');

app.locals = {
	title: _config('title'),
	desc: _config('desc'),
	href: _config('root'),
	version: _config('version'),
	root: __dirname
}

var logout = require('./routes/logout.js'),
	index = require('./routes/index.js'),
	about = require('./routes/about.js'),
	mime = require('./routes/mime.js'),
	trello = require('./routes/trello.js'),
	updateSetting = require('./routes/setting-update.js'),
	subscribeIndex = require('./routes/subscribe-page.js'),
	subscribe = require('./routes/subscribe.js'),
	unsubscribe = require('./routes/unsubscribe.js'),
	checksubscribe = require('./routes/check-subscribe.js'),
	signin = require('./routes/signin.js'),
	html = require('./routes/html.js'),
	send = require('./routes/send.js'),
	update = require('./routes/update.js'),
	setting = require('./routes/setting.js'),
	upload = require('./routes/upload.js'),
	token = require('./routes/token.js');

app.get('/', index);
app.get('/signin', signin);
app.get('/logout',logout);
app.get('/about',about);
app.get('/trello', trello);
app.get('/mime', mime);
app.get('/mime/update',updateSetting);
app.get('/:uid/subscribe',subscribeIndex);
app.get('/:uid/subscribe/:email',subscribe);
app.get('/:uid/subscribe/:email/check',checksubscribe);
app.get('/:uid/unsubscribe/:email',unsubscribe);

// app.post('/creatHtml',html);
app.post('/update', update);
app.post('/send', send);
app.post('/upload',upload);
app.post('/mime/saveSetting',setting);
app.post('/mime/saveToken',token);

// run
http.createServer(app).listen(app.get('port'));