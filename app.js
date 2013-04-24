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
	root: __dirname,
	trelloKey: _config('trello').key
}

app.get('/', require('./routes/index'));
app.get('/signin', require('./routes/signin'));
app.get('/logout', require('./routes/logout'));
app.get('/about', require('./routes/about'));
app.get('/trello', require('./routes/trello'));
app.get('/mime', require('./routes/mime'));
app.get('/mime/update', require('./routes/setting-update'));
app.get('/:uid/subscribe', require('./routes/subscribe-page'));
app.get('/:uid/subscribe/:email', require('./routes/subscribe'));
app.get('/:uid/subscribe/:email/check', require('./routes/check-subscribe'));
app.get('/:uid/unsubscribe/:email', require('./routes/unsubscribe'));

// app.post('/creatHtml', require('./routes/html'));
app.post('/update', require('./routes/update'));
app.post('/send', require('./routes/send'));
app.post('/upload', require('./routes/upload'));
app.post('/mime/saveSetting', require('./routes/setting'));
app.post('/mime/saveToken', require('./routes/token'));

// run
var server = http.createServer(app)
server.listen(app.get('port'));