const searchView = {
  searchForm: function() {
    return `
      <div id="search-form">
        <input type="text" name="search-term" id="search-term">
        <button id="search-button" class="form__button">Search</button>
      </div>
    `;
  },
  searchResults: function(results) {
    return console.log(results);
  },
};

module.exports = searchView;
