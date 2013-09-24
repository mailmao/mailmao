var user = require('../ctrlers/user');

exports.home = function(req, res, next) {
    user.read(res.locals.user._id, function(err, u) {
        if (!err) {
            if (u.trello.token) {
                res.render('mime');
            } else {
                res.redirect('/trello');
            }
        } else {
            next(err);
        }
    });
}

exports.update = function(req, res, next) {
    user.read(res.locals.user._id, function(err, u) {
        if (!err) {
            if (u.trello.token) {
                res.render('mime-update');
            } else {
                res.redirect('/trello');
            }
        } else {
            next(err);
        }
    });
    // user.findById(req.session.uid).exec(function(err, doc) {
    //     if (!err) {

    //         console.log(doc);

    //         // 判断是否授权trello,引导授权trelo
    //         var trelloFlag = doc.trello.token ? true : false;
    //         var trelloInfo = doc.trello.info ? doc.trello.info : '';

    //         res.render('mime-update', {
    //             pageTitle: '我的邮差猫',
    //             desc: '我的邮差猫个人主页',
    //             userInfo: req.session.user,
    //             trelloFlag: trelloFlag,
    //             setting: doc.setting,
    //             trelloInfo: trelloInfo
    //         });

    //     } else {
    //         res.send(errHandler('db'));
    //     }
    // });
}