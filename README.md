![](http://ww3.sinaimg.cn/large/61ff0de3jw1e6jccxfhgvj202s039t8j.jpg)

### [邮差猫 Mailmao](http://mailmao.com)

基于Trello的周报发送服务，采用以下技术构建：

- Node/Express
- mongodb
- nodeMailer

### 此猫是啥

写这个项目的初衷很简单，刚来支付宝的时候，要写周报，基本上是个强制性的东西。大家知道每周五写周报的时候很烦的，第一个烦的事情是上周写的周报要用很低效的方法去搜（因为你这周还要继续写上周的部分内容嘛），如果平常使用GTD工具或者项目管理工具来管理，还要把每天做的事情，总结好之后呢复制粘贴到新的周报里。这个事情增加了很多成本。

所以邮差猫是基于这个前提来做的，我习惯用trello来管理项目，以及自己的todo，而且trello有很好的移动客户端支持。所以trello相对于国内一些app来说算是不错的（比如彩程的tower），而且Trello是基于Node开发的，本身有非常成熟的api集合，用来做mashup再适合不过。

邮差猫就是一个使用nodemail对trello数据进行排版，然后发报的一个工具。因为自己比较懒，模板我就写了一个。大家以后前往不要用jade来写这种模板层复杂的判断逻辑（我那时还经验不多，这个模板基本是不可维护了），等空闲一点会把不同的ctrler都分开来，现在都写在路由里，乱七八糟估计诸位fork过去也没心思去改。

这玩意其实还可以当企业edm用其实。做自己的触发式邮件也只需要提供一个接口就成了。但都太累，我考虑考虑再看。

### 配置

配置文件地址在 `./lib/config-sample.js` 中，默认为空，填写后请重命名为config.js才能运行。

### 本地测试

1. 安装依赖：`npm install` 
2. 运行服务：`node app`

### 效果预览(0.0.1)

![](http://ww3.sinaimg.cn/large/61ff0de3jw1e6jcdq2fetj20dw0bg0uc.jpg)
