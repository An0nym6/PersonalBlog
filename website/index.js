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
        callback(counts);
      });
    } else {
      counts = docs.visits + 1;
      basicInfo.updateOne({}, {$set: {visits : counts}}, function(err, result) {
        assert.equal(err, null);
        callback(counts);
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
      if (docs.visits > 10000)
        docs.visits = (docs.visits / 10000).toFixed(1) + ' 万';
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
      console.log(likes);
      if (likes > 10000)
        likes = (likes / 10000).toFixed(1) + ' 万';
      res.json(likes);
    });
  });
});
router.get('/getLikes', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findBasicInfo(db, function(docs) {
      db.close();
      if (docs.likes > 10000)
        docs.likes = (docs.likes / 10000).toFixed(1) + ' 万';
      res.json(docs.likes);
    });
  });
});

// 获取博文数据
var findBlogInfo = function(db, callback) {
  var blog = db.collection('blog');
  blog.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}
router.get('/blog', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findBlogInfo(db, function(blog) {
      db.close();
      res.json(blog.reverse());
    });
  });
});
// 获取博文内容
var findBlogContent = function(db, title, callback) {
  var essays = db.collection('essays');
  essays.find({title: title}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs[0]);
  });
}
router.post('/essay', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findBlogContent(db, req.body.title, function(essay) {
      db.close();
      if (essay != undefined)
        res.json(essay.content);
      else
        res.json('### 404~未找到标题为 ' + req.body.title + ' 的文章。')
    });
  });
});
// 添加一篇新的博文
var addAnEssay = function(db, body, callback) {
  var date = (new Date()).toString().split(' ');
  var blog = db.collection('blog');
  // 创建博文数据
  blog.insert({title: body.title, details: body.details, time: body.date, likes: 0},
              function(err, result) {
    assert.equal(err, null);
    // 创建博文内容
    var essays = db.collection('essays');
    essays.insert({title: body.title, content: body.content}, function(err, result) {
      assert.equal(err, null);
      // 创建博文评论
      var essaysComments = db.collection('essaysComments');
      essaysComments.insert({title: body.title, comments: []}, function(err, result) {
        assert.equal(err, null);
        callback(result);
      });
    });
  });
}
router.post('/addEssay', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addAnEssay(db, req.body, function() {
      db.close();
      res.json('success');
    });
  });
});
// 删除一篇博文
var deleteAnEssay = function(db, title, callback) {
  // 删除博文数据
  var blog = db.collection('blog');
  blog.deleteOne({title: title}, function(err, result) {
    assert.equal(err, null);
    // 删除博文内容
    var essays = db.collection('essays');
    essays.deleteOne({title: title}, function(err, result) {
      assert.equal(err, null);
      // 删除博文评论
      var essaysComments = db.collection('essaysComments');
      essaysComments.deleteOne({title: title}, function(err, result) {
        assert.equal(err, null);
        callback(result);
      });
    });
  });
}
router.post('/deleteEssay', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    deleteAnEssay(db, req.body.title, function() {
      db.close();
      res.json('success');
    });
  });
});
// 获取某篇博文的评论
var findCommentsForAnEssay = function(db, title, callback) {
  var essaysComments = db.collection('essaysComments');
  essaysComments.find({title: title}).toArray(function(err, docs) {
    assert.equal(err, null);
    if (docs[0] != undefined)
      callback(docs[0].comments);
  });
}
router.post('/essayComments', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findCommentsForAnEssay(db, req.body.title, function(comments) {
      db.close();
      res.json(comments);
    });
  });
});
// 添加某篇博文的评论
var addACommentToAnEssay = function(db, body, callback) {
  var essaysComments = db.collection('essaysComments');
  findCommentsForAnEssay(db, body.title, function(comments) {
    comments.unshift({name: body.name, text: body.text});
    essaysComments.updateOne({title: body.title}
      , {$set: {comments: comments} }, function(err, result) {
      assert.equal(err, null);
      callback(comments);
    });
  });
}
router.post('/addEssayComments', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addACommentToAnEssay(db, req.body, function(comments) {
      db.close();
      res.json(comments);
    });
  });
});
// 获取谋篇博文的点赞
var getLikesOfAnEssay = function(db, title, callback) {
  var blog = db.collection('blog');
  blog.find({title: title}).toArray(function(err, docs) {
    assert.equal(err, null);
    if (docs[0] != undefined)
      callback(docs[0].likes);
    else
      callback(0);
  });
}
router.post('/essayLikes', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    getLikesOfAnEssay(db, req.body.title, function(likes) {
      db.close();
      res.json(likes);
    });
  });
});
// 为某篇博文点赞
var plusOneToLikesOfAnEssay = function(db, title, callback) {
  var blog = db.collection('blog');
  getLikesOfAnEssay(db, title, function(likes) {
    count = likes + 1;
    blog.updateOne({title: title}, {$set: {likes: count} }, function(err, result) {
      assert.equal(err, null);
      callback(count);
    });
  });
}
router.post('/likeAnEssay', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    plusOneToLikesOfAnEssay(db, req.body.title, function(likes) {
      db.close();
      res.json(likes);
    });
  });
});

// 获取所有的创意秀
var findShows = function(db, callback) {
  var shows = db.collection('shows');
  shows.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}
router.get('/show', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findShows(db, function(shows) {
      db.close();
      res.json(shows);
    });
  });
});
// 添加新的创意秀
var addAShow = function(db, body, callback) {
  var shows = db.collection('shows');
  shows.insert({imgUrl: body.imgUrl, title: body.title,
                details: body.details, likes: 0}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}
router.post('/addShow', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addAShow(db, req.body, function(shows) {
      db.close();
      res.json('success');
    });
  });
});
// 删除创意秀
var deleteAShow = function(db, title, callback) {
  var shows = db.collection('shows');
  shows.deleteOne({title: title}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}
router.post('/deleteShow', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    deleteAShow(db, req.body.title, function(shows) {
      db.close();
      res.json('success');
    });
  });
});
// 为某个创意秀点赞
var plusOneToLikesOfShow = function(db, title, callback) {
  var shows = db.collection('shows');
  shows.find({title: title}).toArray(function(err, docs) {
    assert.equal(err, null);
    count = docs[0].likes + 1;
    shows.updateOne({title: title}, {$set: {likes : count}}, function(err, result) {
      assert.equal(err, null);
      findShows(db, function(shows) {
        callback(shows);
      });
    });
  });
}
router.post('/likeAShow', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    plusOneToLikesOfShow(db, req.body.title, function(shows) {
      db.close();
      res.json(shows);
    });
  });
});

// 获取时间轴
var findTimeline = function(db, callback) {
  var timeline = db.collection('timeline');
  timeline.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}
router.get('/timeline', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findTimeline(db, function(timeline) {
      db.close();
      res.json(timeline);
    });
  });
});
// 添加新的时间节点
var addATimePoint = function(db, body, callback) {
  var date = new Date();
  var timeline = db.collection('timeline');
  timeline.insert({icon: body.icon, imgUrl: body.imgUrl, title: body.title,
                   details: body.details, time: body.time,
                   likes: 0}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}
router.post('/addTimePoint', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addATimePoint(db, req.body, function(shows) {
      db.close();
      res.json('success');
    });
  });
});
// 删除时间节点
var deleteATimePoint = function(db, title, callback) {
  var timeline = db.collection('timeline');
  timeline.deleteOne({title: title}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}
router.post('/deleteTimePoint', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    deleteATimePoint(db, req.body.title, function(shows) {
      db.close();
      res.json('success');
    });
  });
});
// 为某个时间节点点赞
var plusOneToLikesOfTimePoint = function(db, title, callback) {
  var timeline = db.collection('timeline');
  timeline.find({title: title}).toArray(function(err, docs) {
    assert.equal(err, null);
    count = docs[0].likes + 1;
    timeline.updateOne({title: title}, {$set: {likes : count}}, function(err, result) {
      assert.equal(err, null);
      findTimeline(db, function(timeline) {
        callback(timeline);
      });
    });
  });
}
router.post('/likeATimePoint', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    plusOneToLikesOfTimePoint(db, req.body.title, function(timeline) {
      db.close();
      res.json(timeline);
    });
  });
});

// 关于我页面的留言
// 获取留言
var findAboutMeComments = function(db, callback) {
  var aboutMeComments = db.collection('aboutMeComments');
  aboutMeComments.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}
router.get('/aboutMeComments', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findAboutMeComments(db, function(aboutMeComments) {
      db.close();
      res.json(aboutMeComments);
    });
  });
});
// 添加留言
var insertAboutMeComments = function(db, body, callback) {
  var aboutMeComments = db.collection('aboutMeComments');
  aboutMeComments.insert(body, function(err, result) {
    assert.equal(err, null);
    findAboutMeComments(db, function(aboutMeComments) {
      callback(aboutMeComments);
    });
  });
}
router.post('/aboutMeComments', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertAboutMeComments(db, req.body, function(aboutMeComments) {
      db.close();
      res.json(aboutMeComments);
    });
  });
});

// Google 验证
router.get('/google71d2d927a3f2b300.html', function(req, res, next) {
  res.sendFile('google71d2d927a3f2b300.html');
});

module.exports = router
