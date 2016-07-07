var gulp = require('gulp');

var imageMin = require('gulp-imagemin');

var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

var gulpLiveScript = require('gulp-livescript');
var uglify = require('gulp-uglify');

var express = require('express');
var app = express();

var del = require('del');

var liveReload = require('gulp-livereload');

// 将 sass 编译为 min.css
gulp.task('sass', function () {
  return gulp.src('src/sass/*.sass')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('static/css'));
});

// 将 ls 编译为 min.js
gulp.task('ls', ['sass'], function() {
  return gulp.src('src/ls/*.ls')
    .pipe(gulpLiveScript({bare: true}))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('static/js'));
});

// express app 启动
gulp.task('express', ['ls'], function() {
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000');
  });
});

// 默认启动项
gulp.task('default', ['express'], function() {

});

// 清空编译后的文件
gulp.task('clean', function() {
  return del(['static/css/*', 'static/js/*']);
});

// 观察文件变化
gulp.task('watch', function() {
  gulp.watch('src/sass/*.sass', ['sass']);
  gulp.watch('src/ls/*.ls', ['ls']);
  liveReload.listen();
  gulp.watch(['static/**']).on('change', liveReload.changed);
});
