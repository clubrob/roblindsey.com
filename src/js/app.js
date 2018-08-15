const homeController = require('./controllers/home-controller');
const feedController = require('./controllers/feed-controller');
const searchController = require('./controllers/search-controller');
const workView = require('./views/work-view');
const contactView = require('./views/contact-view');

const baseUrl =
  'https://us-central1-roblindseydesign.cloudfunctions.net/rldesign/';
const path = window.location.pathname;
const hash = window.location.hash.substr(2);

// Home route
if (path === '/' || path === '/index.html') {
  const homeLink = document.querySelector('#nav_home_link');
  homeLink.innerHTML = `<img src="/images/svg/botdot.svg" alt="Rob Lindsey Design - Home">`;
  homeController.home(baseUrl);
}
// Feed route
if (path === '/feed/' || path === '/feed/index.html') {
  if (hash.length > 0) {
    const slug = hash;
    feedController.feedItem(baseUrl, slug);
  } else {
    feedController.feedList(baseUrl);
  }
}
// Feed tag routes
if (path === '/feed/tag/' || path === '/feed/tag/index.html') {
  if (hash.length > 0) {
    const tag = hash;
    feedController.tagList(baseUrl, tag);
  } else {
    window.location.replace('/feed/');
  }
}
// Feed category routes
if (path === '/feed/category/' || path === '/feed/category/index.html') {
  if (hash.length > 0) {
    const category = hash;
    feedController.categoryList(baseUrl, category);
  } else {
    window.location.replace('/feed/');
  }
}
// Search route
if (path === '/search/' || path === '/search/index.html') {
  document.querySelector('#search-activate').style.display = 'none';
  const results = JSON.parse(localStorage.getItem('results'));
  searchController.searchPage();
}
// Work route
if (path === '/work/' || path === '/work/index.html') {
  workView(baseUrl);
}
// Contact route
if (path === '/contact/' || path === '/contact/index.html') {
  contactView(baseUrl);
}
// Event listeners
// Preserve back button during active modal
window.addEventListener('popstate', () => {
  window.location.reload();
});

// Modal events
// Modal container
const feedModal = document.querySelector('#item__modal');
const modalContent = feedModal.querySelector('.modal__content');
function closeModal() {
  feedModal.classList.remove('active');
  modalContent.innerHTML = '';
}
document.addEventListener('click', event => {
  let link = event.target;
  // Open modal
  if (
    link &&
    (link.matches('.modal-trigger') || link.matches('.modal-trigger>img'))
  ) {
    // Event delegation to match linked images
    if (link.matches('img')) {
      link = link.parentElement;
    }
    const slug = link.hash.substr(2);

    if (slug.length > 0) {
      feedModal.classList.add('active');
      feedController.feedItemModal(baseUrl, slug);
    }
    event.preventDefault();
  }
  // Close modal
  if (link && link.matches('.modal__close')) {
    closeModal();
    event.preventDefault();
  }
});
// Search events
function searchHandler() {
  localStorage.clear();
  const searchTerm = document.querySelector('#search-term').value;
  searchController.searchAction(searchTerm);
}
const searchActivate = document.querySelector('#search-activate');
searchActivate.addEventListener('click', event => {
  feedModal.classList.add('active');
  searchController.searchForm();
  event.preventDefault();
});
document.addEventListener('click', event => {
  const btn = event.target;
  if (btn && btn.matches('#search-button')) {
    searchHandler();
    event.preventDefault();
  }
});
document.addEventListener('keydown', event => {
  const input = event.target;
  if (input && input.matches('#search-term') && event.keyCode === 13) {
    searchHandler();
  }
});
// Pagination
document.addEventListener('click', event => {
  let link = event.target;

  if (link && (link.matches('#page_next') || link.matches('#page_previous'))) {
    feedController.paginate(baseUrl, link.dataset.type, link.dataset.page);
    window.scrollTo(0, 0);
    event.preventDefault();
  }
});
