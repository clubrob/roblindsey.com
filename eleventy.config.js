import { plugins } from "./config/plugins.js";
import { filters } from "./config/filters.js";
import { collections } from "./config/collections.js";

export default async function (eleventyConfig) {
	// Passthrough
	eleventyConfig.addPassthroughCopy("src/assets/fonts");
	eleventyConfig.addPassthroughCopy("src/assets/images");
	eleventyConfig.addPassthroughCopy("src/assets/js");

	// Plugins
	Object.keys(plugins).forEach((name) => {
		eleventyConfig.addPlugin(plugins[name].plugin, plugins[name].options, plugins[name].metadata);
	});

	// Add filters
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName]);
	});

	// Add collections
	Object.keys(collections).forEach((collectionName) => {
		eleventyConfig.addCollection(collectionName, collections[collectionName]);
	});
}

export const config = {
	dir: {
		input: "src",
		output: "public",
		layouts: "layouts",
	},
	passthroughFileCopy: true,
};
