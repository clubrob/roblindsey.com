// String manipulation
const day = require('dayjs');
// CSS processing
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const fontMagic = require('postcss-font-magician');
const csso = require('csso');

module.exports = eleventyConfig => {

  // Filters
  eleventyConfig.addFilter('parseDate', dateObj => {
    return day(dateObj).format('YYYY/MM/DD');
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
      autoprefixer])
      .process(cssCode, {from: undefined})
      .then(result => {
        return cb(null, csso.minify(result.css).css);
      })
      .catch(err => console.error(err));
  });

  // Collections
  eleventyConfig.addCollection('latestPosts', collection => {
    return collection
      .getFilteredByGlob('**/posts/*.md')
      .slice(-2)
      .reverse();
  });

  eleventyConfig
    .addPassthroughCopy('src/assets');

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
