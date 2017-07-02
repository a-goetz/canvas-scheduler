// Inspired by http://jpsierens.com/tutorial-gulp-javascript-2015-react/


/*************************
Declarations and dependencies
*************************/
// Gulp:
// The task runner.
var gulp = require('gulp');

// Browserify:
// Bundles your javascript files together and lets you use modules
// that can be exported and imported in your javascript code.
var browserify = require('browserify');

// vinyl-source-stream:
// Plugin used for working with stream outputs.
// Need this to work with Browserify easily.
var source = require('vinyl-source-stream');

// gulp-util:
// Utility functions for gulp plugins, like nice logging.
var gutil = require('gulp-util');

// babelify:
// This is our transpiler.
// It converts ES6 and JSX to plain old javascript.
// v6.0+ of babelify must include presets in order to work.
// Basically they did the same as react and are embracing 
// the unix philosophy of how to build tools even more. 
// So that means having more plugins that do one thing and 
// do that one thing well.
var babelify = require('babelify');

// External dependencies. Separated so they are not bundled
// every time a JS file is saved, since they are static libraries.
var dependencies = [
	'react',
	'react-dom'
]

// track how many times the script refires.
var scriptsCount = 0;

/*************************
Gulp Tasks
*************************/

gulp.task('scripts', function() {
	// Fired when there's a change in the js file.
	bundleApp(false);
});

gulp.task('deploy', function() {
	// For when we want to deploy to production.
	bundleApp(true);
});

gulp.task('watch', function() {
	// https://www.npmjs.com/package/gulp-watch
	// Watches for changes in the js files.
	// First parameter indicates what to watch.
	// Second parameter is the callback.
	// original: gulp.watch(['./app/*.js'], ['scripts']);
	gulp.watch(['./project/static/scripts/jsx/*.js'], ['scripts']);
});

// When running 'gulp' on the terminal this task will fire.
// It will start watching for changes in every .js file.
// If there's a change, the task 'scripts' defined above will fire.
gulp.task('default', ['scripts', 'watch']);

/*************************
Private Functions
*************************/

function bundleApp(isProduction) {
	// This function is where the bundling and conversion from
	// JSX and ES6 to plain javascript happens.

	// Increment the counter.
	scriptsCount++;

	// Browserify will bundle all our js files together in to one and will let
	// us use modules in the front end.
	var dateBundler = browserify({
		// [[original]] entries: './app/app.js',
		entries: './project/static/scripts/jsx/date_selector.js',
		debug: true
	})

	// If it's not for production, a separate date_selector.js file will be created
	// the first time gulp is run so that we don't have to rebundle things like
	// react everytime there's a change in the js file
	if (!isProduction && scriptsCount === 1) {
		// Create date_selector.js for dev environment.
		browserify({
			require: dependencies,
			debug: true
		})
			.bundle()
			// Handle error
			.on('error', gutil.log)
			// Destination file name
			.pipe(source('date_selector.js'))
			// Destination file folder
			// [[original]] .pipe(gulp.dest('./web/js/'));
			.pipe(gulp.dest('./project/static/scripts/js/'));
	}

	if (!isProduction) {
		// this will make dependencies external so they are not bundled.
		dependencies.forEach(function(dep) {
			dateBundler.external(dep);
		})
	}

	dateBundler
	// babelify transforms ES6 and JSX into ES5
		.transform("babelify", {presets: ["es2015", "react"]})
		.bundle()
		.on('error', gutil.log)
		// Destination file name
		.pipe(source('date_bundle.js'))
		// Destination file folder.
		// [[original]] .pipe(gulp.dest('./web/js/'));
		.pipe(gulp.dest('./project/static/scripts/js/'));
}

/*
// requirements
var gulp = require('gulp');
var gulpBrowser = require("gulp-browser");
var reactify = require('reactify');
var del = require('del');
var size = require('gulp-size');

// tasks
gulp.task('transform', function () {
    var stream = gulp.src('./project/static/scripts/jsx/*.js')
  	   .pipe(gulpBrowser.browserify({transform: ['reactify']}))
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
*/