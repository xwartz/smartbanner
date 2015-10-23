var gulp = require('gulp');
var babel = require('gulp-babel');
// var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
// var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');


var dirs = {
    src: './src',
    styles: './src/styles',
    scripts: './src/scripts',
    dest : './dist'
};

gulp.task('styles', function() {
  gulp.src(dirs.styles + '/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: false
    }))
    .pipe(gulp.dest(dirs.dest))
    .pipe(minifycss())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(dirs.dest));
});

gulp.task('scripts', function() {
  gulp.src(dirs.scripts + '/*.js')
    .pipe(plumber())
    .pipe(babel({modules: 'umd'}))
    .pipe(gulp.dest(dirs.dest))
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(dirs.dest));
});

gulp.task('watch', function () {
    gulp.watch(dirs.src + '/**/*', ['styles','scripts']);
})