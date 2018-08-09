const homeView = require('./views/home-view');
const {
  feedView,
  singleItem,
  tagList,
  categoryList,
} = require('./views/feed-view');
const workView = require('./views/work-view');
const contactView = require('./views/contact-view');

const endpoint =
  'https://us-central1-roblindseydesign.cloudfunctions.net/rldesign/';
const path = window.location.pathname;
const hash = window.location.hash.substr(2);

// Home route
if (path === '/' || path === '/index.html') {
  const homeLink = document.querySelector('#nav_home_link');
  homeLink.innerHTML = `<img src="/images/svg/botdot.svg" alt="Rob Lindsey Design - Home">`;
  homeView(endpoint);
}
// Feed route
if (path === '/feed/' || path === '/feed/index.html') {
  if (hash.length > 0) {
    const slug = hash;
    singleItem(endpoint, slug);
  } else {
    feedView(endpoint);
  }
}
// Feed tag routes
if (path === '/feed/tag/' || path === '/feed/tag/index.html') {
  if (hash.length > 0) {
    const slug = hash;
    tagList(endpoint, slug);
  } else {
    window.location.replace('/feed/');
  }
}
// Feed category routes
if (path === '/feed/category/' || path === '/feed/category/index.html') {
  if (hash.length > 0) {
    const slug = hash;
    console.log('you are here: ', slug);
    categoryList(endpoint, slug);
  } else {
    window.location.replace('/feed/');
  }
}
// Work route
if (path === '/work/' || path === '/work/index.html') {
  workView(endpoint);
}
// Contact route
if (path === '/contact/' || path === '/contact/index.html') {
  contactView(endpoint);
}
// Event listeners
// Preserve back button during active modal
window.addEventListener('popstate', () => {
  window.location.reload();
});
// Modal events
document.addEventListener('click', event => {
  let link = event.target;
  if (
    link &&
    (link.matches('.modal-trigger') || link.matches('.modal-trigger>img'))
  ) {
    // Event delegation to match linked images
    if (link.matches('img')) {
      link = link.parentElement;
    }
    const slug = link.hash.substr(1);
    if (slug.length > 0) {
      window.location.assign(`/feed/#${slug}`);
      const feedModal = document.querySelector('#feed__modal');
      feedModal.classList.add('active');
      singleItem(endpoint, slug);
    }
    event.preventDefault();
  }

  if (link && link.matches('.modal__close')) {
    const feedModal = document.querySelector('#feed__modal');
    const modalContent = feedModal.querySelector('.modal__content');

    feedModal.classList.remove('active');
    modalContent.innerHTML = '';
    window.history.back();
    event.preventDefault();
  }
});
