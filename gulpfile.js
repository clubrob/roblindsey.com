const path = require('path');
const gulp = require('gulp');
const del = require('del');
// const pug = require('gulp-pug');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const terser = require('gulp-uglify-es').default;
const webpackStream = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const browser = require('browser-sync').create();
const historyApi = require('connect-history-api-fallback');
// require('dotenv').config();

gulp.task('clean:dist', () => {
  return del(['dist/**/*']);
});

gulp.task('bundleJSDev', () =>
  gulp
    .src('src/js/app.js', { sourcemaps: true })
    .pipe(
      webpackStream({
        mode: 'development',
        output: {
          filename: 'app.bundle.js',
        },
        devtool: 'inline-source-map',
        node: {
          fs: 'empty',
        },
        /* plugins: [
          new webpackStream.webpack.EnvironmentPlugin([
            'FIREBASE_API_KEY',
            'FIREBASE_AUTH_DOMAIN',
            'FIREBASE_PROJECT_ID',
            'FIREBASE_DB_URL',
            'FIREBASE_STORAGE_BUCKET',
          ]),
        ], */
      })
    )
    .pipe(gulp.dest('dist/js/'))
    .pipe(browser.stream())
);

gulp.task('bundleJS', () =>
  gulp
    .src('src/js/app.js')
    .pipe(
      webpackStream({
        mode: 'production',
        output: {
          filename: 'app.bundle.js',
        },
        node: {
          fs: 'empty',
        },
        /* plugins: [
          new webpackStream.webpack.EnvironmentPlugin([
            'FIREBASE_API_KEY',
            'FIREBASE_AUTH_DOMAIN',
            'FIREBASE_PROJECT_ID',
            'FIREBASE_DB_URL',
            'FIREBASE_STORAGE_BUCKET',
          ]),
        ], */
      })
    )
    .pipe(terser())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browser.stream())
);

gulp.task('bundleCSS', () =>
  gulp
    .src('src/scss/style.scss')
    .pipe(
      sass({
        includePaths: [path.join(__dirname, 'node_modules')],
      })
    )
    .pipe(csso())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browser.stream())
);

gulp.task('cleanHTML', () =>
  gulp
    .src(['src/views/**/*.html', '!src/views/**/_*.html'])
    .pipe(gulp.dest('dist/'))
    .pipe(browser.stream())
);

gulp.task('optimizeImages', done => {
  gulp
    .src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images/'));
  done();
});

gulp.task(
  'serve',
  gulp.parallel(['optimizeImages', 'bundleCSS', 'bundleJSDev', 'cleanHTML'], () => {
    browser.init({
      server: {
        baseDir: './dist',
        middleware: [historyApi()],
      },
    });

    gulp.watch('src/scss/**/*.scss', gulp.series('bundleCSS'));
    gulp.watch('src/js/**/*.js', gulp.series('bundleJSDev'));
    gulp.watch('src/views/**/*.html', gulp.series('cleanHTML'));
    gulp.watch('src/images/**/*', gulp.series('optimizeImages'));
  })
);

gulp.task('default', gulp.series('serve'));
gulp.task('build', gulp.parallel('optimizeImages', 'bundleCSS', 'bundleJS', 'cleanHTML'));
gulp.task('prod', gulp.series('clean:dist', 'build'));
