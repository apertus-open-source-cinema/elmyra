var babel = require('gulp-babel'),
    concat = require('gulp-concat')
    del = require('del'),
    gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    streamqueue  = require('streamqueue'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    zip = require('gulp-zip');

var platform = 'linux';
gulp.task('windows', function(callback) {
  platform = 'windows';
  callback();
});

gulp.task('osx', function(callback) {
  platform = 'osx';
  callback();
});

gulp.task('linux', function(callback) {
  platform = 'linux';
  callback();
});

var release = false;
gulp.task('enable-release', function(callback) {
  release = true;
  callback();
});

gulp.task('clean', function() {
  return del([
    'static/css',
    'static/fonts',
    'static/js'
  ]);
});

gulp.task('css', function() {
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

gulp.task('fonts', function() {
  return gulp.src('src/lib/octicons-3.3.0/octicons.woff')
             .pipe(gulp.dest('static/fonts/'));
});

gulp.task('js', function() {
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
             'src/jsx/wizard/animated-cross-section.jsx',
             'src/jsx/wizard/cross-section.jsx',
             'src/jsx/wizard/modifier-type.jsx',
             'src/jsx/wizard/style-type.jsx',
             'src/jsx/wizard/camera-type.jsx',
             'src/jsx/wizard/media-resolution.jsx',
             'src/jsx/wizard/model.jsx',
             'src/jsx/wizard/media-length.jsx',
             'src/jsx/wizard/media-type.jsx',
             'src/jsx/wizard/wizard.jsx',
             'src/jsx/navigation.jsx',
             'src/jsx/application.jsx'
           ]).pipe(babel())
         )
        .pipe(concat('scripts.js'))
        .pipe(release ? uglify() : util.noop())
        .pipe(gulp.dest('static/js/'));
});

gulp.task('configure-windows', function() {
  return gulp.src([
           'lib/windows/renderer.bat',
           'lib/windows/server.bat',
         ])
         .pipe(gulp.dest('.'));
});

gulp.task('configure-osx', function() {
  return gulp.src([
           'lib/osx/renderer',
           'lib/osx/server',
         ])
         .pipe(gulp.dest('.'));
});

gulp.task('configure-linux', function() {
  return gulp.src([
           'lib/linux/renderer',
           'lib/linux/server',
         ])
         .pipe(gulp.dest('.'));
});

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('css', 'fonts', 'js'))
);

gulp.task('default', gulp.series('build'));

gulp.task('watch', function() {
  gulp.watch('src/**/*', gulp.series('build'));
});


gulp.task('zip', function() {
  var configuration;
  if(platform === 'windows') {
    configuration = [
      'lib/windows/renderer.bat',
      'lib/windows/server.bat',
    ]
  } else if(platform === 'osx') {
    configuration = [
      'lib/osx/renderer',
      'lib/osx/server',
    ];
  } else if(platform === 'linux') {
    configuration = [
      'lib/linux/renderer',
      'lib/linux/server',
    ];
  }

  return streamqueue(
           { objectMode: true },
           gulp.src(configuration),
           gulp.src([
             'lib/elmyra/**/*',
             'lib/' + platform + '/**/*',
             'static/**/*',
             'templates/**/*',
             'LICENSE',
             'README.md',
             '*.py',
             '!server',
             '!renderer',
             '!server.bat',
             '!renderer.bat',
           ], { base: '.' })
         )
         .pipe(zip('elmyra-preview-' + platform + '.zip'))
         .pipe(gulp.dest('release/'));
});

gulp.task(
  'release',
  gulp.series('enable-release', 'build', 'zip')
);

gulp.task('release-windows', gulp.series('windows', 'release'));
gulp.task('release-osx', gulp.series('osx', 'release'));
gulp.task('release-linux', gulp.series('linux', 'release'));
gulp.task('release-all', gulp.series('release-windows', 'release-osx', 'release-linux'));
gulp.task('release-lib', function() {
  return gulp.src([
           'lib/**/*',
         ], { base: '.' })
         .pipe(zip('elmyra-lib.zip'))
         .pipe(gulp.dest('release/'));
});
