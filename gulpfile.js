var babel = require('gulp-babel'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat')
    del = require('del'),
    fsExtra = require('fs-extra'),
    git = require('git-rev-sync'),
    gulp = require('gulp'),
    packager = require('electron-packager'),
    streamqueue  = require('streamqueue'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    zip = require('gulp-zip')

var release = null

gulp.task('configure-windows', function(callback) {
  release = 'windows'
  callback()
})

gulp.task('configure-macos', function(callback) {
  release = 'macos'
  callback()
})

gulp.task('configure-linux', function(callback) {
  release = 'linux'
  callback()
})

gulp.task('configure-dev', function(callback) {
  release = null
  callback()
})

gulp.task('clean', function() {
  return del([
    'static/css',
    'static/fonts',
    'static/js',
    'library.py',
    '*.run',
    '*.bat',
  ])
})

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
        .pipe(gulp.dest('static/css/'))
})

gulp.task('fonts', function() {
  return gulp.src('src/lib/octicons-3.3.0/octicons.woff')
             .pipe(gulp.dest('static/fonts/'))
})

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
        .pipe(gulp.dest('static/js/'))
})

gulp.task('platform-library', function() {
  var platform

  if(release === 'windows' || release === null && process.platform === 'win32') {
    platform = 'windows'
  } else if(release === 'macos' || release === null && process.platform === 'darwin') {
    platform = 'macos'
  } else if(release === 'linux' || release === null && process.platform === 'linux') {
    platform = 'linux'
  }

  return gulp.src('src/' + platform + '/*').pipe(gulp.dest('.'))
})

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('css', 'fonts', 'js', 'platform-library')
  )
)

gulp.task('build-windows', gulp.series('configure-windows', 'build'))
gulp.task('build-macos', gulp.series('configure-macos', 'build'))
gulp.task('build-linux', gulp.series('configure-linux', 'build'))
gulp.task('build-dev', gulp.series('configure-dev', 'build'))

gulp.task('watch', function() {
  gulp.watch('src/**/*', gulp.series('build'))
})

gulp.task('default', gulp.series('build', 'watch'))

gulp.task('package', async callback => {
  const options = {
    arch: 'x64',
    dir: '.',
    name: 'elmyra',
    out: './release',
    overwrite: true,
    ignore: [
      '^/.babelrc$',
      '^/.gitignore$',
      '^/.stylintrc$',
      '^/gulpfile.js$',
      '^/LIB_SPECS.md$',
      '^/README.md$',
      '^/__pycache__',
      '^/imports/',
      '^/src',
      '^/tmp/',
      '^/uploads/',
      '^/visualizations/'
    ]
  };

  if(release === 'windows' || release === null && process.platform === 'win32') {
    options.icon = './icons/elmyra.ico';
    options.ignore.push('^/lib/(macos|linux)');
    options.platform = 'win32';
  } else if(release === 'macos' || release === null && process.platform === 'darwin') {
    options.icon = './icons/elmyra.icns';
    options.ignore.push('^/lib/(linux|windows)');
    options.platform = 'darwin';
  } else if(release === 'linux' || release === null && process.platform === 'linux') {
    options.ignore.push('^/lib/(macos|windows)');
    options.platform = 'linux';
  }

  const appPaths = await packager(options);

  gulp.src(`${appPaths[0]}/**/*`, { base: appPaths[0] })
      .pipe(zip(`elmyra-${git.short()}-${release}.zip`))
      .pipe(gulp.dest('release/'))
      .on('end', () => {
        fsExtra.remove(appPaths[0], err => {
          if(err) {
            console.log(err);
            process.exit(1);
          }

          callback();
        });
      });
});

gulp.task(
  'release',
  gulp.series(
    gulp.series('build-windows', 'package'),
    gulp.series('build-macos', 'package'),
    gulp.series('build-linux', 'package'),
    gulp.series('build-dev')
  )
)

gulp.task('release-lib', function() {
  return gulp.src([
           'lib/**/*',
         ], { base: '.' })
         .pipe(zip('elmyra-lib.zip'))
         .pipe(gulp.dest('release/'))
})
