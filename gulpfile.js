var babel = require('gulp-babel'),
    concat = require('gulp-concat')
    del = require('del'),
    git = require('git-rev-sync'),
    gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    streamqueue  = require('streamqueue'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    zip = require('gulp-zip');

var release = null;

gulp.task('configure-windows', function(callback) {
  release = 'windows';
  callback();
});

gulp.task('configure-macos', function(callback) {
  release = 'macos';
  callback();
});

gulp.task('configure-linux', function(callback) {
  release = 'linux';
  callback();
});

gulp.task('configure-dev', function(callback) {
  release = null;
  callback();
});

gulp.task('clean', function() {
  return del([
    'static/css',
    'static/fonts',
    'static/js',
    '*.run',
    '*.bat',
  ]);
});

gulp.task('css', function() {
  return streamqueue(
           { objectMode: true },
           gulp.src([
             'src/lib/bootstrap-3.3.5/css/bootstrap.css',
             'src/lib/bootstrap-3.3.5/css/bootstrap-theme.css',
             'src/lib/octicons-3.3.0/octicons.css',
           ]),
           gulp.src([
             'src/styl/main.styl',
             'src/styl/navigation.styl',
             'src/styl/preview.styl',
             'src/styl/wizard.styl',
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
             'src/lib/react-15.4.0/react.js',
             'src/lib/react-15.4.0/react-dom.js',
             'src/lib/bootstrap-3.3.5/js/bootstrap.js',
             'src/lib/moment-2.11.1/moment.js',
             'src/lib/clipboard.js-1.5.9/clipboard.js',
             'src/lib/filesize.js-3.1.2/filesize.min.js',
             'src/lib/three.js-r77/three.js',
             'src/lib/OBJLoader.js'
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
             'src/jsx/wizard/media-length.jsx',
             'src/jsx/wizard/media-type.jsx',
             'src/jsx/wizard/orient.jsx',
             'src/jsx/wizard/import.jsx',
             'src/jsx/wizard/wizard.jsx',
             'src/jsx/navigation.jsx',
             'src/jsx/preview.jsx',
             'src/jsx/application.jsx',
           ]).pipe(babel())
         )
        .pipe(concat('scripts.js'))
        .pipe(release ? uglify() : util.noop())
        .pipe(gulp.dest('static/js/'));
});

gulp.task('launchers', function() {
  if(release === 'windows' || release === null && process.platform === 'win32') {

    return gulp.src([
                  'src/windows/renderer.bat',
                  'src/windows/server.bat',
                  'src/windows/dev-server.bat',
                ])
                .pipe(gulp.dest('.'));

  } else if(release === 'macos' || release === null && process.platform === 'darwin') {

    return gulp.src([
                  'src/macos/renderer.run',
                  'src/macos/server.run',
                  'src/macos/dev-server.run',
                ])
                .pipe(gulp.dest('.'));

  } else if(release === 'linux' || release === null && process.platform === 'linux') {

    return gulp.src([
                  'src/linux/renderer.run',
                  'src/linux/server.run',
                  'src/linux/dev-server.run',
                ])
                .pipe(gulp.dest('.'));

  }
});

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('css', 'fonts', 'js', 'launchers'))
);

gulp.task('build-windows', gulp.series('configure-windows', 'build'));
gulp.task('build-macos', gulp.series('configure-macos', 'build'));
gulp.task('build-linux', gulp.series('configure-linux', 'build'));
gulp.task('build-dev', gulp.series('configure-dev', 'build'));

gulp.task('watch', function() {
  gulp.watch('src/**/*', gulp.series('build'));
});

gulp.task('default', gulp.series('build', 'watch'));

gulp.task('zip', function() {
  var releaseFlags = [];
  releaseFlags.push(git.short());
  releaseFlags.push(release);

  return streamqueue(
           { objectMode: true },
           gulp.src([
             'lib/elmyra/**/*',
             'lib/' + release + '/**/*',
             'static/**/*',
             'templates/**/*',
             'LICENSE',
             'README.md',
             '*.py',
             '*.run',
             '*.bat',
           ], { base: '.' })
         )
         .pipe(zip('elmyra-' + releaseFlags.join('-') + '.zip'))
         .pipe(gulp.dest('release/'));
});

gulp.task(
  'release',
  gulp.series(
    gulp.series('build-windows', 'zip'),
    gulp.series('build-macos', 'zip'),
    gulp.series('build-linux', 'zip'),
    gulp.series('build-dev')
  )
);

gulp.task('release-lib', function() {
  return gulp.src([
           'lib/**/*',
         ], { base: '.' })
         .pipe(zip('elmyra-lib.zip'))
         .pipe(gulp.dest('release/'));
});
