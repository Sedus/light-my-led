var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var del = require('del');
var util = require('gulp-util');
var glob = require('glob');
var es = require('event-stream');
var buffer = require('vinyl-buffer');
var flatten = require('gulp-flatten');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var react = require('gulp-react');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var http = require('http'),
    st = require('st');

/*
 var browserSync = require('browser-sync');
 var browserify = require("browserify");
 var babelify = require('babelify');
 var source = require('vinyl-source-stream');
 var sourcemaps = require('gulp-sourcemaps');
 var uglify = require('gulp-uglify');
 */

var options = {
    src: 'src',
    dist: 'dist',
    tmp: '.tmp',
    e2e: 'e2e'
};

gulp.task('clean', function () {
    return del([
        options.dist,
        options.tmp
    ]);
});

gulp.task('build:server', function () {
    return gulp
        .src([options.src + '/server/**/*.js'])
        .pipe(gulp.dest(options.dist));
});

gulp.task('build:client:static', function () {
    return gulp
        .src([options.src + '/client/**/*.html', '!src/client/**.js'])
        .pipe(gulp.dest(options.dist + '/public'))
        .pipe(livereload());
});

gulp.task('create-tmp-js-bundle', function () {
    return gulp
        .src(options.src + '/client/**/*.jsx')
        .pipe(sourcemaps.init())
        .pipe(react())
        .on('error', util.log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(options.tmp))
        .pipe(livereload());
});

gulp.task('images', function () {
    return gulp
        .src([options.src + '/client/**/*.png'])
        .pipe(flatten())
        .pipe(gulp.dest(options.dist + '/public/images'))
        .pipe(livereload());
});

gulp.task('build:client:js', ['create-tmp-js-bundle'], function (done) {
    glob(options.tmp + '/**/*.js', function (err, files) {
        if (err) done(err);

        var tasks = files.map(function (entry) {
            return browserify({entries: [entry]})
                //.external(['react', 'react-router'])
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    extname: '.bundle.js'
                }));
        });
        es
            .merge(tasks)
            .pipe(buffer())
            .pipe(concat('bundle.js'))
            .pipe(gulp.dest(options.dist + '/public/js'))
            .on('end', done);
    })
});

gulp.task('serv', function (done) {
    http.createServer(
        st({path: __dirname + '/' + options.dist + '/public', index: 'index.html', cache: false})
    ).listen(8080, done);
});


gulp.task('watch', ['serv'], function () {
    livereload.listen({
        basePath: options.dist + '/public'
    });
    //gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
    gulp.watch(options.src + '/client/**/*.html', ['build:client:static'], {readDelay: 10000});
    gulp.watch(options.src + '/client/**/*.jsx', ['build:client:js'], {readDelay: 5000});
    gulp.watch(options.src + '/client/**/*.png', ['images'], {readDelay: 30000});
});

gulp.task('build', ['build:server', 'build:client:static', 'images', 'build:client:js']);
gulp.task('default', ['clean'], function () {
    gulp.start('build', ['watch']);
});