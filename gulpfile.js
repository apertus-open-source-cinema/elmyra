var babel = require('gulp-babel'),
    concat = require('gulp-concat')
    del = require('del'),
    gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    streamqueue  = require('streamqueue'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    watch = require('gulp-watch'),
    zip = require('gulp-zip');

var platform = 'linux';
var release = false;

gulp.task('clean', function() {
  return del([
    'static/css',
    'static/fonts',
    'static/js'
  ]);
});

gulp.task('css', ['clean'], function() {
  return streamqueue(
           { objectMode: true },
           gulp.src([
             'src/lib/bootstrap-3.3.5/css/bootstrap.css',
             'src/lib/bootstrap-3.3.5/css/bootstrap-theme.css',
             'src/lib/octicons-3.3.0/octicons.css',
             'src/lib/featherlight-1.3.5/featherlight.min.css'
           ]),
           gulp.src([
             'src/styl/main.styl',
             'src/styl/navigation.styl',
             'src/styl/wizard.styl'
           ]).pipe(stylus())
         )
        .pipe(concat('styles.css'))
        .pipe(release ? cssnano() : util.noop())
        .pipe(gulp.dest('static/css/'));
});

gulp.task('fonts', ['clean'], function() {
  return gulp.src('src/lib/octicons-3.3.0/octicons.woff')
             .pipe(gulp.dest('static/fonts/'));
});

gulp.task('js', ['clean'], function() {
  return streamqueue(
           { objectMode: true },
           gulp.src([
             'src/lib/jquery-2.2.0.js',
             'src/lib/react-0.14.6/react.js',
             'src/lib/react-0.14.6/react-dom.js',
             'src/lib/bootstrap-3.3.5/js/bootstrap.js',
             'src/lib/moment-2.11.1/moment.js',
             'src/lib/clipboard.js-1.5.9/clipboard.js',
             'src/lib/filesize.js-3.1.2/filesize.min.js',
             'src/lib/featherlight-1.3.5/featherlight.min.js',
             'src/lib/three.js-r73/three.js'
           ]),
           gulp.src([
             'src/jsx/index/download-button.jsx',
             'src/jsx/index/embed-button.jsx',
             'src/jsx/index/update-button.jsx',
             'src/jsx/index/versions.jsx',
             'src/jsx/index/visualization.jsx',
             'src/jsx/wizard/id.jsx',
             'src/jsx/wizard/modifier-type.jsx',
             'src/jsx/wizard/style-type.jsx',
             'src/jsx/wizard/camera-type.jsx',
             'src/jsx/wizard/media-resolution.jsx',
             'src/jsx/wizard/model.jsx',
             'src/jsx/wizard/media-length.jsx',
             'src/jsx/wizard/media-type.jsx',
             'src/jsx/wizard/navigation.jsx',
             'src/jsx/wizard/wizard.jsx',
             'src/jsx/navigation.jsx',
             'src/jsx/application.jsx'
           ]).pipe(babel())
         )
        .pipe(concat('scripts.js'))
        .pipe(release ? uglify() : util.noop())
        .pipe(gulp.dest('static/js/'));
});

gulp.task('configure', function() {
  return gulp.src(['lib/' + platform + '/configuration.py'])
  .pipe(gulp.dest('.'));
});

gulp.task('configure-windows', function() {
  platform = 'windows';
  return gulp.start('configure');
});

gulp.task('configure-osx', function() {
  platform = 'osx';
  return gulp.start('configure');
});

gulp.task('configure-linux', function() {
  platform = 'linux';
  return gulp.start('configure');
});

gulp.task('build', ['css', 'fonts', 'js']);

gulp.task('build-release', function() {
  release = true;
  return gulp.start('build');
});

gulp.task('default', ['build']);

gulp.task('watch', function() {
  watch('src/**/*', function() {
      gulp.start('default');
  });
});

gulp.task('release', ['build-release'], function() {
  return streamqueue(
           { objectMode: true },
           gulp.src([
             'lib/' + platform + '/configuration.py'
           ]),
           gulp.src([
             'lib/elmyra/**/*',
             'lib/' + platform + '/**/*',
             'static/**/*',
             'templates/**/*',
             'LICENSE',
             'README.md',
             'requirements.txt',
             '*.py',
             '!configuration.py'
           ], { base: '.' })
         )
         .pipe(zip('elmyra-preview-' + platform + '.zip'))
         .pipe(gulp.dest('release/'));
});

gulp.task('release-windows', function() {
  platform = 'windows';
  return gulp.start('release');
});

gulp.task('release-osx', function() {
  platform = 'osx';
  return gulp.start('release');
});

gulp.task('release-linux', function() {
  platform = 'linux';
  return gulp.start('release');
});

gulp.task('release-lib', function() {
  return gulp.src([
           'lib/**/*',
         ], { base: '.' })
         .pipe(zip('elmyra-lib.zip'))
         .pipe(gulp.dest('release/'));
});
