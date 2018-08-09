const createItem = require('../tools/create-item');

const loader = `
  <div class="loader">
    <img src="/images/svg/loading.svg" alt="loading...">
  </div>
`;

function firstLetterToUpper(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

const feedView = function(endpoint) {
  const feedSection = document.querySelector('#feed');
  feedSection.innerHTML = `<h1 class="title feed__title">Feed.</h1>`;
  const feedCards = document.querySelector('#feed__cards');
  feedCards.innerHTML = loader;
  return fetch(endpoint + 'feed')
    .then(res => {
      return res.json();
    })
    .then(res => {
      feedCards.innerHTML = '';
      res.forEach(item => {
        feedCards.innerHTML += createItem(item, 'card');
      });
      return;
    })
    .catch(err => console.error(err.message));
};

const singleItem = function(endpoint, slug) {
  console.log('you are at item view');
  const feedModal = document.querySelector('#feed__modal');
  const modalContent = feedModal.querySelector('.modal__content');

  feedModal.classList.add('active');
  modalContent.innerHTML = loader;
  return fetch(endpoint + `feed/${slug}`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      modalContent.innerHTML = '';
      res.forEach(data => {
        modalContent.innerHTML = createItem(data, 'item');
      });
      return;
    })
    .catch(err => console.error(err.message));
};

const tagList = function(endpoint, slug) {
  const feedSection = document.querySelector('#feed');
  feedSection.innerHTML = `<h1 class="title feed__title">Tag: ${slug}.</h1>`;
  const feedCards = document.querySelector('#feed__cards');
  feedCards.innerHTML = loader;
  return fetch(endpoint + `tag/${slug}`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      feedCards.innerHTML = '';
      res.forEach(item => {
        feedCards.innerHTML += createItem(item, 'card');
      });
      return;
    })
    .catch(err => console.error(err.message));
};

const categoryList = function(endpoint, slug) {
  const header = firstLetterToUpper(slug);
  const feedSection = document.querySelector('#feed');
  feedSection.innerHTML = `<h1 class="title feed__title">${header}s.</h1>`;
  const feedCards = document.querySelector('#feed__cards');
  feedCards.innerHTML = loader;
  return fetch(endpoint + `category/${slug}`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      feedCards.innerHTML = '';
      res.forEach(item => {
        feedCards.innerHTML += createItem(item, 'card');
      });
      return;
    })
    .catch(err => console.error(err.message));
};

module.exports = { feedView, singleItem, tagList, categoryList };
