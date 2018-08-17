const createItem = require('../tools/create-item');
const feedView = require('../views/feed-view');
const { fetchHelper } = require('../tools/util');
const loader = require('../views/loader-view');

const feedController = {
  feedList: function(baseUrl) {
    const feedSection = document.querySelector('#feed');
    feedSection.innerHTML = feedView.feedListHeader();
    const feedCards = document.querySelector('#feed__cards');
    feedCards.innerHTML = loader;

    return fetchHelper(baseUrl, 'feed')
      .then(res => {
        feedCards.innerHTML = '';
        res.docs.forEach(item => {
          feedCards.innerHTML += createItem(item, 'card');
        });
        let paginationOptions = {
          previous: res.pages.prev,
          next: res.pages.next,
          type: 'feed',
        };
        feedCards.innerHTML += feedView.pagination(paginationOptions);
        return;
      })
      .catch(err => console.error(err.message));
  },
  feedItem: function(baseUrl, slug) {
    const feedSection = document.querySelector('#feed');
    const feedCards = document.querySelector('#feed__cards');
    feedCards.innerHTML = loader;

    return fetchHelper(baseUrl, `feed/${slug}`)
      .then(res => {
        feedCards.innerHTML = '';
        res.forEach(item => {
          if (item.item_type === 'post') {
            feedSection.innerHTML = feedView.itemHeader(item.title);
          }
          feedCards.innerHTML = createItem(item, 'item');
        });
        return;
      })
      .catch(err => console.error(err.message));
  },
  feedItemModal: function(baseUrl, slug) {
    const feedModal = document.querySelector('#item__modal');
    const modalContent = feedModal.querySelector('.modal__content');

    feedModal.classList.add('active');
    modalContent.innerHTML = loader;

    return fetchHelper(baseUrl, `feed/${slug}`)
      .then(res => {
        modalContent.innerHTML = '';
        return res.forEach(item => {
          modalContent.innerHTML = createItem(item, 'modal');
        });
      })
      .catch(err => console.error(err.message));
  },
  tagList: function(baseUrl, tag) {
    const feedSection = document.querySelector('#feed');
    feedSection.innerHTML = feedView.tagListHeader(tag);
    const feedCards = document.querySelector('#feed__cards');
    feedCards.innerHTML = loader;

    return fetchHelper(baseUrl, `tag/${tag}`)
      .then(res => {
        feedCards.innerHTML = '';
        res.docs.forEach(item => {
          feedCards.innerHTML += createItem(item, 'card');
        });
        return;
      })
      .catch(err => console.error(err.message));
  },
  categoryList: function(baseUrl, category) {
    const feedSection = document.querySelector('#feed');
    feedSection.innerHTML = feedView.categoryListHeader(category);
    const feedCards = document.querySelector('#feed__cards');
    feedCards.innerHTML = loader;

    return fetchHelper(baseUrl, `category/${category}`)
      .then(res => {
        feedCards.innerHTML = '';
        res.docs.forEach(item => {
          feedCards.innerHTML += createItem(item, 'card');
        });
        let paginationOptions = {
          previous: res.pages.prev,
          next: res.pages.next,
          type: `category/${category}`,
        };
        feedCards.innerHTML += feedView.pagination(paginationOptions);
        return;
      })
      .catch(err => console.error(err.message));
  },
  paginate: function(baseUrl, contentType, page) {
    const feedCards = document.querySelector('#feed__cards');
    feedCards.innerHTML = loader;
    let endpoint = contentType + page;

    return fetchHelper(baseUrl, endpoint)
      .then(res => {
        feedCards.innerHTML = '';
        res.docs.forEach(item => {
          feedCards.innerHTML += createItem(item, 'card');
        });
        let paginationOptions = {
          previous: res.pages.prev,
          next: res.pages.next,
          type: 'feed',
        };
        feedCards.innerHTML += feedView.pagination(paginationOptions);
        return;
      })
      .catch(err => console.error(err.message));
  },
};

module.exports = feedController;
