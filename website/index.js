var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('layout', { title: "RANDOM THOUGHTS | 刘忍的个人博客" });
});

var timeline = [{icon: 'travel', imgUrl: 'img/timeline/timeline1.png', title: '剑桥之旅',
                 details: '悄悄的我走了，正如我悄悄的来；我挥一挥衣袖，不带走一片云彩...',
                 time: '2015年8月', likes: 12},
                {icon: 'study', imgUrl: 'img/timeline/timeline2.png', title: '中山大学',
                 details: '白云山高，珠江水长，吾校矗立，蔚为国光， 中山手创，遗泽余芳...',
                 time: '2014年8月', likes: 31}];

router.get('/timeline', function(req, res, next) {
  res.json(timeline);
});

module.exports = router;
