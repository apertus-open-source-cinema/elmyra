var babel = require('gulp-babel'),
    concat = require('gulp-concat')
    del = require('del'),
    gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    streamqueue  = require('streamqueue'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    zip = require('gulp-zip');

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
             'src/lib/octicons-3.3.0/octicons.css'
           ]),
           gulp.src('src/styl/main.styl').pipe(stylus())
         )
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('static/css/'));
        // .pipe(minifyCSS())
});

gulp.task('fonts', function() {
  return gulp.src('src/lib/octicons-3.3.0/octicons.woff')
             .pipe(gulp.dest('static/fonts/'));
});

gulp.task('js', function() {
  return streamqueue(
           { objectMode: true },
           gulp.src([
             'src/lib/jquery-2.1.4.min.js',
             'src/lib/react-0.14.3/build/react.js',
             'src/lib/react-0.14.3/build/react-dom.js',
             'src/lib/bootstrap-3.3.5/js/bootstrap.js',
             'src/lib/moment-2.10.6/moment.js',
             'src/lib/clipboard.js-1.5.2/dist/clipboard.js',
             'src/lib/filesize.js-3.1.2/filesize.min.js'
           ]),
           gulp.src([
             'src/jsx/download-button.jsx',
             'src/jsx/embed-field.jsx',
             'src/jsx/processing-state.jsx',
             'src/jsx/versions.jsx',
             'src/jsx/visualization.jsx',
             'src/jsx/visualizations.jsx',
             'src/jsx/main.jsx'
           ]).pipe(babel()),
           gulp.src('src/js/visualization-wizard.js')
         )
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('static/js/'));
        // .pipe(uglify())
});

gulp.task('compile', ['css', 'fonts', 'js']);

gulp.task('build', ['clean'], function() {
  gulp.start('compile')
});

gulp.task('default', function() {
  gulp.start('build');
});

gulp.task('watch', function() {
  watch('src/**/*', function() {
      gulp.start('default');
  });
});

gulp.task('release', ['build'], function() {
  gulp.src([
    'library/**/*',
    'static/**/*',
    'templates/**/*',
    'LICENSE',
    'README.md',
    'requirements.txt',
    '*.py'
  ], { base: '.' })
  .pipe(zip('elmyra-release.zip'))
  .pipe(gulp.dest('.'))
});
