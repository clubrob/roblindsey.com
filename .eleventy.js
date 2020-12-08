// 11ty plugins
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rss = require("@11ty/eleventy-plugin-rss");
// String manipulation
const moment = require('moment-timezone');
const yaml = require("js-yaml");

module.exports = eleventyConfig => {
	// Plugins
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(rss);
	// Passthrough
	eleventyConfig.addPassthroughCopy({"src/_includes/css/*.map": "/"});
	eleventyConfig.addPassthroughCopy("src/assets");
	eleventyConfig.addPassthroughCopy("src/sw.js");
	eleventyConfig.addPassthroughCopy("src/manifest.json");

	// Shortcodes
	eleventyConfig.addNunjucksShortcode("theYear", function () {
		return moment(new Date()).format("YYYY");
	});

	// Filters
	eleventyConfig.addFilter('parseDate', dateString => {
		// dateString is ISO format
		return moment(dateString).tz('America/New_York').format('YYYY/MM/DD');
	});
	eleventyConfig.addFilter('parseDateReadable', dateString => {
		// datestring is UNIX format
		return moment.unix(Number(dateString)).tz('America/New_York').format('MMMM D, YYYY');
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

	// Data
	eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));

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
