const algoliasearch = require('algoliasearch');

const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_KEY
);

const index = algolia.initIndex(String(process.env.ALGOLIA_INDEX_NAME));

const search = {
  postSearch: function(searchString) {
    return index.search(searchString).catch(err => console.error(err));
  },
};

module.exports = search;
