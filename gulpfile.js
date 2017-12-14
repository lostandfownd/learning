const gulp = require('gulp'),
  handlebars = require('gulp-compile-handlebars'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  wrap = require('gulp-wrap'),
  declare = require('gulp-declare'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  minifycss = require('gulp-minify-css'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync');


////  Tasks Section:
gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./dist"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

// Run this as separate task
gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
    ]))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('scss', function(){
  gulp.src(['src/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

//  Move CSS plugins
gulp.task('move-styles', function () {
  gulp.src('src/styles/**/*.css')
    .pipe(gulp.dest('dist/styles/vendor'));
});

//  Move Js plugins
gulp.task('move-scriptPlugins', function () {
  gulp.src('src/scripts/plugins/**/*.js')
    .pipe(gulp.dest('dist/scripts/plugins'));
});

gulp.task('scripts', function(){
  return gulp.src('src/scripts/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

// TODO: Change this task to .php
// after finishing the static frontend
gulp.task('html', () => {
  return gulp.src('./src/view/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/view/templates']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist'));
});

// Build Task
//NOTE: Run this the first time so you will have the project up and running
gulp.task('build', ['html', 'scss', 'move-styles', 'move-scriptPlugins', 'scripts', 'images']);


// Development Task
gulp.task('development', ['browser-sync'], function(){
  gulp.watch("src/scss/**/*.scss", ['scss']);
  gulp.watch("src/styles/**/*.css", ['move-styles']);
  gulp.watch("src/scripts/plugins/*.js", ['move-scriptPlugins']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("src/view/**/*.hbs", ['html']);
  gulp.watch("dist/*.html", ['bs-reload']);
});
