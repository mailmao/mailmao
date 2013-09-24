![logo](http://ww3.sinaimg.cn/large/61ff0de3gw1e8xjt122lpj201e01mmwy.jpg) [邮差猫](http://mailmao.com)
---

基于 Trello 的邮件发送服务，结合 Trello 的日程管理，发送排版优雅的邮件，是您居家旅行写代码发周报必备工具。

![screenshot](http://ww1.sinaimg.cn/large/61ff0de3gw1e8xjy1tqpgj20eo0c8wfi.jpg)

#### 如何安装
````
$ npm install mailmao
````

#### 范例代码

签出代码库，填好配置文件
````
$ git clone https://github.com/turingou/Mailmao.git
$ cd Mailmao
$ cp server-sample.js server.js
$ vi server.js
````
在 `server-sample.js`，你需要填充以下配置：
- name: 站点名称
- url: 当`env`为production的时候，站点的根url
- database: 相应的数据库信息（mongodb）
- duoshuo: 用于支持多说的社会化登录
- trello: 在trello dev center注册的app key
- smtp: 发件服务的smtp信息，包括服务器，端口，邮箱用户名密码等
- upyun: 用于托管发件中banner图片的bucket信息

运行服务：
````
$ node server.js
````
或者使用守护程序持久运行服务：
````
$ forever start server.js
````

#### 邮差猫的故事

写这个项目的初衷很简单，刚来支付宝的时候，要写周报，基本上是个强制性的东西。大家知道每周五写周报的时候很烦的，第一个烦的事情是上周写的周报要用很低效的方法去搜（因为你这周还要继续写上周的部分内容嘛），如果平常使用GTD工具或者项目管理工具来管理，还要把每天做的事情，总结好之后呢复制粘贴到新的周报里。这个事情增加了很多成本。

所以邮差猫是基于这个前提来做的，我习惯用trello来管理项目，以及自己的todo，而且trello有很好的移动客户端支持。所以trello相对于国内一些app来说算是不错的（比如彩程的tower），而且Trello是基于Node开发的，本身有非常成熟的api集合，用来做mashup再适合不过。

邮差猫就是一个使用nodemail对trello数据进行排版，然后发报的一个工具。因为自己比较懒，模板我就写了一个。大家以后前往不要用jade来写这种模板层复杂的判断逻辑（我那时还经验不多，这个模板基本是不可维护了），等空闲一点会把不同的ctrler都分开来，现在都写在路由里，乱七八糟估计诸位fork过去也没心思去改。

这玩意其实还可以当企业edm用其实。做自己的触发式邮件也只需要提供一个接口就成了。但都太累，我考虑考虑再看。