var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: '刘忍的新博客' });
});

module.exports = router;
