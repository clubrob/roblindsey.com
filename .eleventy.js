// 11ty plugins
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rss = require("@11ty/eleventy-plugin-rss");
// String manipulation
const day = require("dayjs");

module.exports = eleventyConfig => {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rss);
  // Passthrough
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/sw.js");
  eleventyConfig.addPassthroughCopy("src/manifest.json");

  // Shortcodes
  eleventyConfig.addNunjucksShortcode("theYear", function () {
    return day(new Date()).format("YYYY");
  });

  // Filters
  eleventyConfig.addFilter("parseDate", dateObj => {
    return day(dateObj).format("YYYY/MM/DD");
  });
  eleventyConfig.addFilter("parseDateReadable", dateObj => {
    return day(dateObj).format("MMMM D, YYYY");
  });
  eleventyConfig.addFilter("bookCover", isbn => {
    // return `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    return `https://images-na.ssl-images-amazon.com/images/P/${isbn}.01._SCLZZZZZZZ_.jpg-M.jpg`;
  });
  eleventyConfig.addFilter("bookUrl", isbn => {
    return `https://www.goodreads.com/book/isbn/${isbn}`;
  });

  eleventyConfig.addFilter("ratingToStars", num => {
    let stars = "";
    for (let i = 0; i < num; i++) {
      stars += "★";
    }
    return stars;
  });

  // Collections
  eleventyConfig.addCollection("posts", collection => {
    return collection.getFilteredByGlob("**/posts/*.md").reverse();
  });
  eleventyConfig.addCollection("latestPosts", collection => {
    return collection
      .getFilteredByGlob("**/posts/*.md")
      .slice(-2)
      .reverse();
  });

  return {
    templateFormats: ["njk", "md"],
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "www"
    },
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
