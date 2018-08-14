const search = require('../tools/search');
const searchView = require('../views/search-view');

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
        localStorage.setItem('results', JSON.stringify(results.hits));
        return window.location.replace('/search');
      })
      .catch(err => console.error(err));
  },
  searchResults: function(results) {
    return searchView.searchResults(results);
  },
};

module.exports = searchController;
