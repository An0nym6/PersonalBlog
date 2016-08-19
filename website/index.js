var express = require('express');
var router = express.Router();

// 引入 MongoDB
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost:27017/myproject';

// 初始化
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  db.collection('basicInfo').count(function (err, count) {
    if (!err && count === 0) {
      db.collection('basicInfo').insert({likes: 0, visits: 0}, function(err, result) {
        assert.equal(err, null);
        console.log('成功初始化数据库');
        db.close();
      });
    }
  });
});

// 主体部分
// 获取网站基本信息
var findBasicInfo = function(db, callback) {
  var basicInfo = db.collection('basicInfo');
  basicInfo.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs[0]);
  });
}
// 更新网站基本信息
var plusOneToBasicInfo = function(db, likesOrVisits, callback) {
  var basicInfo = db.collection('basicInfo');
  findBasicInfo(db, function(docs) {
    if (likesOrVisits == 'likes') {
      counts = docs.likes + 1;
      basicInfo.updateOne({}, {$set: {likes : counts}}, function(err, result) {
        assert.equal(err, null);
        callback(result);
      });
    } else {
      counts = docs.visits + 1;
      basicInfo.updateOne({}, {$set: {visits : counts}}, function(err, result) {
        assert.equal(err, null);
        callback(result);
      });
    }
  }); 
}

// 访问量
router.get('/visits', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findBasicInfo(db, function(docs) {
      db.close();
      res.json(docs.visits);
    });
  });
});
// 默认路径的导航
router.get('/', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    plusOneToBasicInfo(db, 'visits', function(visits) {
      db.close();
    });
  });
  res.render('layout', { title: "RANDOM THOUGHTS | 刘忍的个人博客" });
});

// 点赞
router.get('/likes', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    plusOneToBasicInfo(db, 'likes', function(likes) {
      db.close();
      res.json(likes);
    });
  });
});
router.get('/getLikes', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findBasicInfo(db, function(docs) {
      db.close();
      res.json(docs.likes);
    });
  });
});

var blog = [{title: 'TOEFL 英语笔记——口语部分', details: '本文作为 TOEFL 英语笔记的第一个部分，' +
             '首先简单地梳理一下 TOEFL 考试的基本组成...', time: '15-AUG-2'},
            {title: '基于 MM 算法对 BT 模型的排序', details: '现实生活中个体间的差异与优劣往往是以两两' +
             '比对的形式进行，但是两个个体间的比对有时候会出现如下的困境...', time: '15-JUL-6'}];

router.get('/blog', function(req, res, next) {
  res.json(blog);
});

var essays = [{title: 'TOEFL 英语笔记——口语部分', content: '# TOEFL 英语笔记——口语部分'},
              {title: '基于 MM 算法对 BT 模型的排序', content: '# 基于 MM 算法对 BT 模型的排序'}];

router.post('/essay', function(req, res, next) {
  for (i in essays)
    if (essays[i].title == req.body.title) {
      res.json(essays[i].content);
      break;
    }
});

// 这里给出一个 comments 的数组，用于所有的文章评论
var comments = [{name: '刘忍', text: '文章写得真好看！'},
                {name: '罗小黑', text: '喵~'}];

var essaysComments = [{title: 'TOEFL 英语笔记——口语部分', comments: comments},
                      {title: '基于 MM 算法对 BT 模型的排序', comments: comments}];

router.post('/essayComments', function(req, res, next) {
  for (i in essaysComments)
    if (essaysComments[i].title == req.body.title) {
      res.json(essaysComments[i].comments);
      break;
    }
});

router.post('/addEssayComments', function(req, res, next) {
  for (i in essaysComments)
    if (essaysComments[i].title == req.body.title) {
      essaysComments[i].comments.unshift({name: req.body.name, text: req.body.text});
      res.json(essaysComments[i].comments);
      break;
    }
});

var show = [{imgUrl: 'img/show/algorithm.jpg', title: '算法分享平台',
             details: '学术网站有 Stackoverflow 这类似的问答型，还有众多的文档和技术博客，' +
             '却没有一个平台能提供算法的分享与交流…', likes: 21},
            {imgUrl: 'img/show/usedPhone.jpg', title: '旧手机利用',
             details: '将旧手机当成钟和提醒，用户从电脑向云端添加事项，手机则会到点提醒...', likes: 49},
            {imgUrl: 'img/show/DIYApps.jpg', title: 'DIY 应用',
             details: '用户根据喜好自己通过拖拽设计应用 UI...', likes: 34}];

router.get('/show', function(req, res, next) {
  res.json(show);
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

var aboutMeComments = [{name: '刘忍', text: '网站做得真好看！'},
                       {name: '罗小黑', text: '喵~'}];

router.get('/aboutMeComments', function(req, res, next) {
  res.json(aboutMeComments);
});

router.post('/aboutMeComments', function(req, res, next) {
  aboutMeComments.unshift(req.body);
  res.json(aboutMeComments);
});

module.exports = router
