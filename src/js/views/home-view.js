const createItem = require('../tools/create-item');

const loader = `
  <div class="loader">
    <img src="/images/svg/loading.svg" alt="loading...">
  </div>
`;

const homeView = function(endpoint) {
  console.log('you are at home view');
  const frontCardsSection = document.querySelector('#home__cards');
  const frontCards = frontCardsSection.querySelector('.cards');
  frontCards.innerHTML = loader;
  return fetch(endpoint + 'featured')
    .then(res => {
      return res.json();
    })
    .then(res => {
      frontCards.innerHTML = '';
      res.forEach(item => {
        frontCards.innerHTML += createItem(item, 'card');
      });
      return;
    })
    .catch(err => console.error(err.message));
};

module.exports = homeView;
