var gulp = require('gulp');

var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

var gulpLiveScript = require('gulp-livescript');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var route = require('./index');
var app = express();

var del = require('del');

livereload = require('gulp-livereload');

// 将 sass 编译为 min.css
gulp.task('sass', function () {
  return gulp.src('src/sass/*.sass')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('static/css'))
    .pipe(livereload({ start: true }));
});

// 将 ls 编译为 min.js
gulp.task('ls', ['sass'], function() {
  return gulp.src('src/ls/*.ls')
    .pipe(gulpLiveScript({bare: true}))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('static/js'))
    .pipe(livereload({ start: true }));
});

// express app 启动
gulp.task('express', ['ls'], function() {
  // 设置网站图标
  app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

  // 设置 view engine
  app.set('views', path.join(__dirname, 'src/jade'));
  app.set('view engine', 'jade');

  // 基础设置
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static('static'));
  app.use('/node_modules', express.static(__dirname + '/node_modules/'));

  // 设置路由
  app.use('/', route);

  app.listen(3000, function () {
    console.log('Example app listening on port 3000');
  });
});

// 默认启动项
gulp.task('default', ['express', 'watch'], function() {});

// 清空编译后的文件
gulp.task('clean', function() {
  return del(['static/css/*', 'static/js/*']);
});

// 自动编译
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/sass/*.sass', ['sass']);
  gulp.watch('src/ls/*.ls', ['ls']);
});
