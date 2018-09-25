require('dotenv').config();
// const path = require('path');
const gulp = require('gulp');
const del = require('del');
const imagemin = require('gulp-imagemin');
// HTML processing modules
const shell = require('gulp-shell');
// const nunjucks = require('gulp-nunjucks-render');
// CSS processing modules
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const precss = require('precss');
const colorFunction = require('postcss-color-function');
const autoprefixer = require('autoprefixer');
const fontMagic = require('postcss-font-magician');
const csso = require('gulp-csso');
// JS processing modules
const terser = require('gulp-uglify-es').default;
const webpackStream = require('webpack-stream');
// Dev browser modules
const browser = require('browser-sync').create();

var dist = 'dist';
var src = 'src';

gulp.task('clean:dist', () => {
  return del([`${dist}/**/*`]);
});

gulp.task('bundleJSDev', () =>
  gulp
    .src(`${src}/js/app.js`, { sourcemaps: true })
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
        plugins: [
          /*           new webpackStream.webpack.EnvironmentPlugin([
            'ALGOLIA_APP_ID',
            'ALGOLIA_SEARCH_KEY',
            'ALGOLIA_INDEX_NAME',
          ]), */
        ],
      })
    )
    .pipe(gulp.dest(`${dist}/js/`))
    .pipe(browser.stream())
);

gulp.task('bundleJS', () =>
  gulp
    .src(`${src}/js/app.js`)
    .pipe(
      webpackStream({
        mode: 'production',
        output: {
          filename: 'app.bundle.js',
        },
        node: {
          fs: 'empty',
        },
        plugins: [
          /* new webpackStream.webpack.EnvironmentPlugin([
            'ALGOLIA_APP_ID',
            'ALGOLIA_SEARCH_KEY',
            'ALGOLIA_INDEX_NAME',
          ]), */
        ],
      })
    )
    .pipe(terser())
    .pipe(gulp.dest(`${dist}/js/`))
    .pipe(browser.stream())
);

gulp.task('bundleCSS', () =>
  gulp
    .src(`${src}/css/style.css`)
    .pipe(
      postcss([
        postcssImport(),
        precss(),
        colorFunction(),
        fontMagic({
          variants: {
            'Cabin': {
              '400': [],
              '700': [],
            },
          },
          foundries: ['google'],
        }),
        autoprefixer(),
      ])
    )
    .pipe(csso())
    .pipe(gulp.dest(`${dist}/css/`))
    .pipe(browser.stream())
);

// gulp.task('cleanHTML', () =>
//   gulp
//     .src([`${src}/views/**/*.njk`, `!${src}/views/**/_*.njk`])
//     .pipe(
//       nunjucks({
//         path: [`${src}/views`],
//       })
//     )
//     .pipe(gulp.dest(`${dist}/`))
//     .pipe(browser.stream())
// );

gulp.task('cleanHTML', shell.task('npx eleventy --quiet'));

gulp.task(
  'optimizeImages',
  gulp.parallel(
    // function moveIconFiles(done) {
    //   gulp
    //     .src(`${src}/images/icons/*.{xml,json,ico}`)
    //     .pipe(gulp.dest(`${dist}/images/icons/`));
    //   done();
    // },
    function optimizeImageFiles(done) {
      gulp
        .src(`${src}/images/**/*.{png,gif,jpg,svg}`)
        .pipe(imagemin())
        .pipe(gulp.dest(`${dist}/images/`));
      done();
    }
  )
);

gulp.task(
  'serve',
  gulp.parallel(
    ['optimizeImages', 'bundleCSS', 'bundleJSDev', 'cleanHTML'],
    function browserSyncInit() {
      browser.init({
        server: {
          baseDir: `./${dist}`,
        },
      });

      gulp.watch(`${src}/css/**/*.css`, gulp.series('bundleCSS'));
      gulp.watch(`${src}/css/**/*.pcss`, gulp.series('bundleCSS'));
      gulp.watch(`${src}/js/**/*.js`, gulp.series('bundleJSDev'));
      gulp.watch(`${src}/views/**/*.{njk,md}`, gulp.series('cleanHTML'));
      gulp.watch(`${src}/images/**/*`, gulp.series('optimizeImages'));
    }
  )
);

gulp.task('default', gulp.series('clean:dist', 'serve'));
gulp.task(
  'build',
  gulp.parallel('optimizeImages', 'bundleCSS', 'bundleJS', 'cleanHTML')
);
gulp.task('prod', gulp.series('clean:dist', 'build'));
