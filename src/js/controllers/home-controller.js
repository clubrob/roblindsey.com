const createItem = require('../tools/create-item');
const { fetchHelper } = require('../tools/util');
const loader = require('../views/loader-view');

const homeController = {
  // Load featured item cards on homepage
  home: function(baseUrl) {
    const frontCardsSection = document.querySelector('#home__cards');
    const frontCards = frontCardsSection.querySelector('.cards');
    frontCards.innerHTML = loader;
    return fetchHelper(baseUrl, 'featured')
      .then(res => {
        frontCards.innerHTML = '';
        return res.forEach(item => {
          frontCards.innerHTML += createItem(item, 'card');
        });
      })
      .catch(err => console.error(err.message));
  },
};

module.exports = homeController;
