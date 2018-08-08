const path = require('path');
const gulp = require('gulp');
const del = require('del');
const imagemin = require('gulp-imagemin');
// const pug = require('gulp-pug');
// CSS processing modules
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const fontMagic = require('postcss-font-magician');
const csso = require('gulp-csso');
// JS processing modules
const terser = require('gulp-uglify-es').default;
const webpackStream = require('webpack-stream');
// Dev browser modules
const browser = require('browser-sync').create();
const historyApi = require('connect-history-api-fallback');

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
      })
    )
    .pipe(terser())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browser.stream())
);

gulp.task('bundleCSS', () =>
  gulp
    .src('src/css/style.css')
    .pipe(
      postcss([
        postcssImport(),
        precss(),
        fontMagic({
          variants: {
            'Josefin Sans': {
              '300': [],
              '700': [],
            },
          },
          foundries: ['google'],
        }),
        autoprefixer(),
      ])
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
  gulp.parallel(
    ['optimizeImages', 'bundleCSS', 'bundleJSDev', 'cleanHTML'],
    function browserSyncInit() {
      browser.init({
        server: {
          baseDir: './dist',
          middleware: [historyApi()],
        },
      });

      gulp.watch('src/css/**/*.css', gulp.series('bundleCSS'));
      gulp.watch('src/css/**/*.pcss', gulp.series('bundleCSS'));
      gulp.watch('src/js/**/*.js', gulp.series('bundleJSDev'));
      gulp.watch('src/views/**/*.html', gulp.series('cleanHTML'));
      gulp.watch('src/images/**/*', gulp.series('optimizeImages'));
    }
  )
);

gulp.task('default', gulp.series('clean:dist', 'serve'));
gulp.task(
  'build',
  gulp.parallel('optimizeImages', 'bundleCSS', 'bundleJS', 'cleanHTML')
);
gulp.task('prod', gulp.series('clean:dist', 'build'));
