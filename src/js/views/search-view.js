const searchView = {
  searchForm: function(term) {
    term = term || '';
    return `
      <div id="search-form" class="form">
        <input type="text" name="search-term" id="search-term" value="${term}" class="form__input">
        <button id="search-button" class="form__button">Search</button>
      </div>
    `;
  },
  searchHeader: function(title) {
    return `<h1 class="title search__title">${title}.</h1>`;
  },
};

module.exports = searchView;
