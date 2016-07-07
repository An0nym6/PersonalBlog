var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

// express app 启动
var express = require('express');
var app = express();

gulp.task('express', ['sass'], function() {
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000');
  });
});

// 将 sass 编译为 min.css
gulp.task('sass', function () {
  return gulp.src('static/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('static/css'));
});

gulp.task('default', ['express'], function() {

});
