// config
var config = {
	title: '邮差猫',
	desc: '从此爱上写周报',
	version: '1.5',
	root: 'http://mailmao.com:8080',
	dev: 'http://dev.mailmao.com:8080',
	trello: {
		key: 'you trello key here'
	},
	weibo: {
		key: 'you weibo key here',
		secret: 'you weibo secret here',
		redirect: 'http:/mailmao.com/signin'
	},
	smtp: {
		server: 'smtp.qq.com',
		port: 25,
		useAuth: true,
		email: "xxxx@mailmao.com",
		password: "your password",
		from: '邮差猫 <xxxx@mailmao.com>'
	},
	upyun: {
		cave: 'upyun空间名',
		user: 'upyun空间管理员',
		password: 'upyun空间管理员密码',
		baseUrl: 'upyun空间三级域名'
	}
}

module.exports = function(type) {
	return config[type];
}