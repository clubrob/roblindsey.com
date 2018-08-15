const search = require('../tools/search');
const createItem = require('../tools/create-item');
const searchView = require('../views/search-view');
const loader = require('../views/loader-view');

const searchController = {
  searchForm: function() {
    const feedModal = document.querySelector('#item__modal');
    const modalContent = feedModal.querySelector('.modal__content');
    modalContent.innerHTML = searchView.searchForm();
  },
  searchAction: function(searchTerm) {
    search
      .postSearch(searchTerm)
      .then(results => {
        sessionStorage.setItem(
          'rld_searchresults',
          JSON.stringify(results.hits)
        );
        sessionStorage.setItem('rld_searchterm', searchTerm);
        return window.location.replace('/search');
      })
      .catch(err => console.error(err));
  },
  searchPage: function() {
    // Dynamic title / search box
    let title = 'Search';
    let term = '';
    if (sessionStorage.getItem('rld_searchterm')) {
      title = 'Results';
      term = sessionStorage.getItem('rld_searchterm');
    }
    const searchSection = document.querySelector('#search');
    searchSection.innerHTML =
      searchView.searchHeader(title) + searchView.searchForm(term);
    // Loop through
    const searchCards = document.querySelector('#search__cards');
    searchCards.innerHTML = loader;
    let sessionResults = JSON.parse(
      sessionStorage.getItem('rld_searchresults')
    );
    if (sessionResults.length > 0) {
      searchCards.innerHTML = '';
      sessionResults.forEach(result => {
        searchCards.innerHTML += createItem(result, 'card');
      });
    } else {
      searchCards.innerHTML = `<p class="no-results">No Results</p>`;
    }
  },
};

module.exports = searchController;
