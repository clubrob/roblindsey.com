// 11ty plugins
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const rss = require('@11ty/eleventy-plugin-rss');
// String manipulation
const day = require('dayjs');
// CSS processing
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const fontMagic = require('postcss-font-magician');
const csso = require('csso');
// HTML processing
const htmlmin = require('html-minifier');

module.exports = eleventyConfig => {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rss);
  // Passthrough
  eleventyConfig
    .addPassthroughCopy('src/assets');
  eleventyConfig
    .addPassthroughCopy('src/sw.js');
  eleventyConfig
    .addPassthroughCopy('src/now.json');

  // Transforms
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Filters
  eleventyConfig.addFilter('parseDate', dateObj => {
    return day(dateObj).format('YYYY/MM/DD');
  });
  eleventyConfig.addFilter('parseDateReadable', dateObj => {
    return day(dateObj).format('D MMMM, YYYY');
  });
  eleventyConfig.addFilter('bookCover', isbn => {
    // return `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    return `https://images-na.ssl-images-amazon.com/images/P/${isbn}.01._SCLZZZZZZZ_.jpg-M.jpg`;
  });
  eleventyConfig.addFilter('bookUrl', isbn => {
    return `https://www.goodreads.com/book/isbn/${isbn}`;
  });

  eleventyConfig.addFilter('ratingToStars', num => {
    let stars = '';
    for (let i = 0; i < num; i++) {
      stars += '★';
    }
    return stars;
  });
  eleventyConfig.addNunjucksAsyncFilter('cssmin', (cssCode, cb) => {
    // return csso.minify(cssCode).css;
    return postcss([
        postcssImport,
        precss,
        fontMagic({
          variants: {
            'Cabin': {
              '400': [],
              '700': [],
            },
          },
          foundries: ['google'],
        }),
        autoprefixer
      ])
      .process(cssCode, {
        from: undefined
      })
      .then(result => {
        return cb(null, csso.minify(result.css).css);
      })
      .catch(err => console.error(err));
  });

  // Collections
  eleventyConfig.addCollection('posts', collection => {
    return collection
      .getFilteredByGlob('**/posts/*.md')
      .reverse();
  });
  eleventyConfig.addCollection('latestPosts', collection => {
    return collection
      .getFilteredByGlob('**/posts/*.md')
      .slice(-2)
      .reverse();
  });

  return {
    templateFormats: ['njk', 'md'],
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: 'www',
    },
    'markdownTemplateEngine': 'njk',
    passthroughFileCopy: true
  }
}