const searchView = {
  searchForm: function(term) {
    term = term || '';
    return `
      <div id="search-form" class="form">
        <input type="text" name="search-term" id="search-term" value="${term}" class="form__input">
        <div class="under-search">
          <button id="search-button" class="form__button">Search</button>
          <div>
            <img src="/images/svg/search-by-algolia.svg" alt="Search by Algolia">
          </div>
        </div>
      </div>
    `;
  },
  searchHeader: function(title) {
    return `<h1 class="title search__title">${title}.</h1>`;
  },
};

module.exports = searchView;
