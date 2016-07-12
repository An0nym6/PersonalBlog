var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('layout', { title: "RANDOM THOUGHTS | 刘忍的个人博客" });
});

module.exports = router;
