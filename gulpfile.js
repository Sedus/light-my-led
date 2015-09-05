var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('clean:dist', function () {
    return del([
        'dist'
    ]);
});

gulp.task('dist', function () {
    return gulp
        .src(['./server.js', 'src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean:dist', 'dist']);