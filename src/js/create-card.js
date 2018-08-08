const moment = require('moment');
const marked = require('marked');

const createCard = function(data) {
  console.log(data);
  let type = data.item_type;
  let date = data.date;
  let slug = data.slug;
  let title = data.title || '';
  let body = data.body || '';
  let summary = data.summary || '';
  let storageUrl = data.storage_url || '';
  let alt = data.alt || '';
  let datetime = moment(date).format();
  let friendlyDate = moment(date).format('D MMMM YYYY');
  let url = data.url || '';
  let tags = data.tags || '';

  // Card tags
  let cardTags = '';
  if (tags) {
    let tagArr = Object.keys(tags);
    tagArr.forEach(tag => {
      cardTags += `<span class="card__footer__tag tag"><a href="tag/${tag}">${tag}</a></span>`;
    });
  }
  // Create card image template for pics and posts
  let cardImage = '';
  if (data.item_type === 'post' || data.item_type === 'pic') {
    storageUrl = data.storage_url;
    alt = data.alt;
    cardImage = `
      <div class="card__image">
        <figure class="card__image__image">
          <a href="feed/${slug}"><img src="${storageUrl}" alt="${alt}"></a>
        </figure>
      </div>
    `;
  }
  let cardContent = '';
  if (type === 'post') {
    cardContent = `
      <p class="card__content__title ${type}-title title"><a href="feed/${slug}">${title}</a></p>
      <div class="card__content__body ${type}-body">
        ${summary}
      </div>
    `;
  }
  if (type === 'quip' || type === 'pic') {
    cardContent = `
      <div class="card__content__body ${type}-body">
        ${body}
      </div>
    `;
  }
  if (type === 'clip') {
    cardContent = `
      <p class="card__content__title ${type}-title title"><a href="${url}" target="_blank">${title}</a></p>
      <div class="card__content__body ${type}-body">
        ${summary}
      </div>
    `;
  }
  // Create summary for post
  if (data.item_type === 'post') {
    body = marked(data.body.substr(0, 50)) + ' ...';
  }
  const card = `
    <div class="card">
      <header class="card__header">
        <p class="card__header__date">
          <time datetime="${datetime}">${friendlyDate}</time>
        </p>
        <p class="card__header__type ${type}-corner">
        <a href="feed/category/${type}">${type}</a></p>
      </header>
      ${cardImage}
      <div class="card__content">
        ${cardContent}
      </div>
      <footer class="card__footer">
        <p class="card__footer__title subtitle">Tags:</p>
        <div class="tags">
          ${cardTags}
        </div>
      </footer>
    </div>
  `;
  return card;
};

module.exports = createCard;
