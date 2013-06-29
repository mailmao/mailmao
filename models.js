/**
 * db configs
 */

var mongoose = require('mongoose'),
	db = mongoose.createConnection('localhost', 'mailmao'),
	Schema = mongoose.Schema;

// mongodb 配置
var userModel = new mongoose.Schema({
	id: {
		type: String,
		unique: true
	},
	weibo: {
		token: String,
		info: {}
	},
	trello: {
		token: String,
		info: {}
	},
	setting: {
		title: {
			type: String,
		default:
			''
		},
		email: {
			type: String,
		default:
			''
		},
		banner: {
			type: String,
		default:
			''
		},
		outputBoard: {
			name: {
				type: String,
			default:
				''
			},
			id: {
				type: String,
			default:
				''
			}
		}
	},
	cache: {
		cards: {},
		attrs: {},
		members: {},
		checkLists: {}
	},
	client: [{
		type: Schema.Types.ObjectId,
    	ref: 'client'
	}]
});

var clientModel = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	pin: String,
	history: [{
		type: Schema.Types.ObjectId,
    	ref: 'history'
	}]
});

var historyModel = new mongoose.Schema({
	type: String,
	date: Date,
	desc: String,
	user: {
		type: Schema.Types.ObjectId,
    	ref: 'user'
	}
})

exports.user = db.model('user', userModel);
exports.client = db.model('client', clientModel);
exports.history = db.model('history', historyModel);