
var gulp      = require('gulp'),
  sass          = require('gulp-sass'),
  gutil         = require('gulp-util'),
  autoprefix    = require('gulp-autoprefixer'),
  minifyCSS     = require('gulp-minify-css'),
  neat          = require('node-neat').includePaths,
  bourbon       = require('node-bourbon').includePaths,
  stylish       = require('jshint-stylish'),
  concat        = require('gulp-concat'),
  jshint        = require('gulp-jshint'),
  uglify        = require('gulp-uglify'),
  coffee        = require('gulp-coffee'),
  rename        = require('gulp-rename'),
  wait          = require('gulp-wait'),
  notify        = require('gulp-notify'),
  include       = require('gulp-include'),
  plumber       = require('gulp-plumber')
  browserSync   = require('browser-sync'),
  imagemin      = require('gulp-imagemin'),
  argv          = require('yargs').argv,
  gulpif        = require('gulp-if'),
  reload        = browserSync.reload;

var theme = 'THEME_FOLDER';

var paths = {
  'root':         "wp-content/themes/"+theme+"/assets/",
  'js': {
    "src_watch":  "wp-content/themes/"+theme+"/assets/js/**",
    "src":        "wp-content/themes/"+theme+"/assets/js/**.dev.js",
    "dest":       "wp-content/themes/"+theme+"/js/"
  },
  'scss': {
    "src_watch":  "wp-content/themes/"+theme+"/assets/sass/**",
    "src":        "wp-content/themes/"+theme+"/assets/sass/**.dev.scss",
    "dest":       "wp-content/themes/"+theme+"/css/"
  },
  'img': {
    "src_watch":  "wp-content/themes/"+theme+"/assets/img/**/*",
    "src":        "wp-content/themes/"+theme+"/assets/img/**/*",
    "dest":       "wp-content/themes/"+theme+"/img/"
  }
};

// SASS
gulp.task('sass', function(){
  return gulp.src(paths.scss.src)
    .pipe(sass({includePaths: [bourbon,neat], outputStyle: 'expanded', errLogToConsole: true}))
    .pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename(function(path) { path.basename = path.basename.replace('.dev', '') }))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(gulpif(argv.notify, notify({onLast: true, message: 'SCSS compiled!'})));
});

// JS
gulp.task('js', function(){
  return gulp.src(paths.js.src)
    .pipe(include())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(rename(function(path) { path.basename = path.basename.replace('.dev', '') }))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(gulpif(argv.notify, notify({onLast: true, message: 'JS linted!'})));
});

//Process Images
gulp.task('img', function() {
  return gulp.src(paths.img.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.img.dest))
    .pipe(notify({onLast: true, message: "Images crunched!"}))
});

//Run the tasks listed above
gulp.task('default', function(){
  gulp.start('sass','js','img');
});

//Watch for changes and reload the page
gulp.task('watch', function(){
  gulp.watch(paths.scss.src_watch, ['sass']);
  gulp.watch(paths.js.src_watch, ['js']);
  gulp.watch(paths.img.src_watch, ['img']);
});

gulp.task('server:dev', function() {
    browserSync({
        server: {
            baseDir: paths.root
        }
    });
});

//Task That Runs the Processes Listed Above
gulp.task('devBuild', ['sass', 'js', 'img']);

//Run the Dev Build Task and Then Fire up a Server
//Use the --notify flag to show messages on task completion
gulp.task('dev', ['devBuild', 'server:dev'], function() {
  gulp.watch(paths.scss.src, ['sass']);
  gulp.watch(paths.js.src, ['js']);
});
