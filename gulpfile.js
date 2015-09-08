var gulp = require('gulp');
var util = require('gulp-util');
var concat = require('gulp-concat');
var del = require('del');
var browserSync = require('browser-sync');
var browserify = require("browserify");
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

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
});

gulp.task('create-tmp-js-bundle', function () {
    return gulp
        .src(options.src + '/client/**/*.jsx')
        .pipe(concat('bundle.jsx'))
        .pipe(gulp.dest(options.tmp))
});

gulp.task('build:client:js', ['create-tmp-js-bundle'], function () {
    return browserify(
        {
            entries: options.tmp + '/bundle.jsx',
            extensions: ['.jsx'],
            debug: true
        })
        .transform(babelify.configure({
            optional: ['runtime']
        }))
        .bundle()
        .on('error', util.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(options.dist + '/public/js'));
});

gulp.task('watch', function () {
    //gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
    gulp.watch(options.src + '/client/**/*.html', ['build:client:static']);
    gulp.watch(options.src + '/client/**/*.jsx', ['build:client:js']);
    //gulp.watch(options.src + '/images/**/*', ['images']);
});

gulp.task('serv', function () {
    browserSync({
        server: {
            baseDir: options.dist + '/public'
        },
        open: false,
        notify: false,
        reloadDelay: 500,
        timestamps: false,
        verbose: true
    });
    gulp.watch(['**/*.{html, js}'], [browserSync.reload]);
});

gulp.task('build', ['build:server', 'build:client:static', 'build:client:js']);
gulp.task('default', ['clean'], function () {
    gulp.start('build', ['watch', 'serv']);
});