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
      res.json(essay.content);
    });
  });
});
// 添加一篇新的博文
var addAnEssay = function(db, req, callback) {
  var date = (new Date()).toString().split(' ');
  var blog = db.collection('blog');
  // 创建博文数据
  blog.insert({title: req.body.title, details: req.body.details, time: date[3].substr(2, 2) +
               '-' + date[1] + '-' + date[2]}, function(err, result) {
    assert.equal(err, null);
    // 创建博文内容
    var essays = db.collection('essays');
    essays.insert({title: req.body.title, content: req.body.content}, function(err, result) {
      assert.equal(err, null);
      // 创建博文评论
      var essaysComments = db.collection('essaysComments');
      essaysComments.insert({title: req.body.title, comments: []}, function(err, result) {
        assert.equal(err, null);
        callback(result);
      });
    });
  });
}
router.post('/addEssay', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addAnEssay(db, req, function() {
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
var addACommentToAnEssay = function(db, req, callback) {
  var essaysComments = db.collection('essaysComments');
  findCommentsForAnEssay(db, req.body.title, function(comments) {
    comments.unshift({name: req.body.name, text: req.body.text});
    essaysComments.updateOne({title: req.body.title}
      , {$set: {comments: comments} }, function(err, result) {
      assert.equal(err, null);
      callback(comments);
    });
  });
}
router.post('/addEssayComments', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addACommentToAnEssay(db, req, function(comments) {
      db.close();
      res.json(comments);
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
var addAShow = function(db, req, callback) {
  var shows = db.collection('shows');
  shows.insert({imgUrl: req.body.imgUrl, title: req.body.title,
                details: req.body.details, likes: 0}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}
router.post('/addShow', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addAShow(db, req, function(shows) {
      db.close();
      res.json('success');
    });
  });
});
var deleteAShow = function(db, title, callback) {
  var shows = db.collection('shows');
  console.log(title);
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
