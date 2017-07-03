// requirements
var gulp = require('gulp');
var gulpBrowser = require("gulp-browser");
var babelify = require('babelify');
var del = require('del');
var size = require('gulp-size');

// tasks
gulp.task('transform', function () {
    var stream = gulp.src('./project/static/scripts/jsx/*.js')
  	   .pipe(gulpBrowser.browserify({transform: ['babelify', {presets: ["es2015", "react"]}]}))
 	   .pipe(gulp.dest('./project/static/scripts/js/'))
  	   .pipe(size());
    return stream;
});
gulp.task('del', function () {
    // add task
});

gulp.task('default', function () {
    gulp.start('transform');
    gulp.watch('./project/static/scripts/jsx/*.js', ['transform']);
});
