var Server = require('./app').server;

new Server({
    name: '邮差猫', // 站点名称
    url: 'http://mailmao.com', // 站点url
    desc: '从此爱上写周报', // 站点描述
    database: {
        name: 'mailmao'
    },
    duoshuo: { 
        short_name: 'demo', // 多说 short_name
        secret: 'demo' // 多说 secret
    },
    trello: {
        key: 'you trello key here'
    },
    smtp: {
        server: '',//如果这一行留空则不会发送邮件而是将邮件在网页打开
        port: 25,
        useAuth: true,
        email: "xxxx@mailmao.com",
        password: "your password",
        from: '邮差猫 <xxxx@mailmao.com>'
    },
    upyun: {
        bucket: 'upyun空间名',
        user: 'upyun空间管理员',
        password: 'upyun空间管理员密码',
        baseUrl: 'upyun空间三级域名'
    }
}).run();