var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var streamify = require('gulp-streamify');
var connect = require('gulp-connect');


var configs = require('./configs');

var dependencies = [
	'react'
];

module.exports = function (options) {
	var isDevelopment = (options.environment === "development");

	// Our app bundler
	var appBundler = browserify({
		// using dev components
		entries: [configs.paths.source + '/main.js'],
		// using npm components
   	    transform: ["babelify"],
		debug: isDevelopment,
		fullPaths: isDevelopment,
		extension: ['js']
	});

	// We set our dependencies as externals on our app bundler when developing
	// (isDevelopment ? dependencies : []).forEach(function (dep) {
	// 	appBundler.external(dep);
	// });

	// The rebundle process
	var rebundle = function () {
		var start = Date.now();
		gutil.log('Building APP bundle');
		appBundler.bundle()
			.on('error', gutil.log)
			.pipe(source('main.js'))
			.pipe(gulpif(!isDevelopment, streamify(uglify())))
			.pipe(gulp.dest(configs.folders[options.environment]))
			.pipe(notify(function () {
				gutil.log('APP bundle built in ' + (Date.now() - start) + 'ms');
			}))
			.pipe(connect.reload());
	};

	rebundle();

	return {
		app: rebundle,

		vendor: function () {
			var vendorsBundler = browserify({
				debug: true,
				require: dependencies
			});

			// Run the vendor bundle
			var start = new Date();
			gutil.log('Building VENDORS bundle');
			vendorsBundler.bundle()
				.on('error', gutil.log)
				.pipe(source('vendors.js'))
				.pipe(gulpif(!isDevelopment, streamify(uglify())))
				.pipe(gulp.dest(configs.folders[options.environment]))
				.pipe(notify(function () {
					gutil.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
				}));
		}
	}
};
