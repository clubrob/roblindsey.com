const createCard = require('./create-card');

const endpoint =
  'https://us-central1-roblindseydesign.cloudfunctions.net/rldesign/';

const frontCardsSection = document.querySelector('#front_cards');
const frontCards = frontCardsSection.querySelector('.cards');

fetch(endpoint + 'featured')
  .then(res => {
    return res.json();
  })
  .then(res => {
    res.forEach(item => {
      frontCards.innerHTML += createCard(item);
    });
    return;
  })
  .catch(err => console.error(err.message));
