var gulp = require('gulp')
, coffee = require('gulp-coffee')
, gutil = require('gulp-util')
, mkdirp = require('mkdirp')
, rimraf = require('rimraf')
;

gulp.task('rm -rf ./lib', [], function (cb) {
	rimraf('./lib', cb);
});

gulp.task('mkdir -p ./lib', ['rm -rf ./lib'], function (cb) {
	mkdirp('./lib', cb);
});

gulp.task('clean', [
	'rm -rf ./lib',
	'mkdir -p ./lib'
]);

gulp.task('coffee', ['clean'], function () {
	return gulp.src([
			'./src/**/*.coffee'
		])
		.pipe(coffee({

		}).on('error', gutil.log))
		.pipe(gulp.dest('./lib'))
		;
});

gulp.task('compile', [
	'clean',
	'coffee'
]);

gulp.task('default', [
	'compile'
]);
