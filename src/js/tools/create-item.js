const dayjs = require('dayjs');
const marked = require('marked');

const createItem = function(data, format) {
  let type = data.item_type;
  let date = data.date;
  let slug = data.slug;
  let title = data.title || '';
  let body = data.body || '';
  let summary = data.summary || '';
  let storageUrl = data.storage_url || '';
  let alt = data.alt || '';
  let datetime = dayjs(date).format();
  let friendlyDate = dayjs(date).format('D MMMM YYYY');
  let url = data.url || '';
  let tags = data.tags || '';

  let modalTrigger = format === 'modal' ? '' : 'modal-trigger';
  format = format !== 'card' ? `feed__${format}` : format;

  // Item tags, shown conditionally
  let itemTags = '';
  let tagChunk = '';

  if (Object.keys(tags).length > 0) {
    let tagArr = Object.keys(tags);
    tagArr.forEach(tag => {
      itemTags += `<span class="${format}__footer__tag tag"><a href="/feed/tag/#/${tag}">${tag}</a></span>`;
    });
    tagChunk = `
      <footer class="${format}__footer">
        <p class="${format}__footer__title subtitle">Tags:</p>
        <div class="tags">
          ${itemTags}
        </div>
      </footer>
    `;
  }
  // Create image template for pics and posts
  let itemImage = '';
  if (data.item_type === 'post' || data.item_type === 'pic') {
    storageUrl = data.storage_url;
    alt = data.alt;
    if (format === 'card') {
      itemImage = `
        <div class="${format}__image">
          <figure class="${format}__image__image">
            <a href="/feed/#/${slug}" class="modal-trigger"><img src="${storageUrl}" alt="${alt}"></a>
          </figure>
        </div>
      `;
    } else {
      itemImage = `
        <div class="${format}__image">
          <figure class="${format}__image__image">
            <img src="${storageUrl}" alt="${alt}">
          </figure>
        </div>
      `;
    }
  }
  // Different layouts for content types
  // Post content
  let itemContent = '';
  if (type === 'post') {
    if (format === 'card') {
      body = marked(summary);
      itemContent = `
        ${itemImage}
        <h4 class="${format}__content__title ${type}-title title"><a href="/feed/#/${slug}" class="modal-trigger">${title}</a></h4>
        <div class="${format}__content__body ${type}-body">
          ${body}
        </div>
      `;
    } else {
      body = marked(body);
      itemContent = `
        <h2 class="${format}__content__title ${type}-title title">${title}</h2>
        ${itemImage}
        <div class="${format}__content__body ${type}-body">
          ${body}
        </div>
      `;
    }
  }
  // Quip content
  if (type === 'quip') {
    body = marked(body);
    itemContent = `
      <div class="${format}__content__body ${type}-body">
        ${body}
      </div>
    `;
  }
  // Pic content
  if (type === 'pic') {
    body = marked(body);
    itemContent = `
      ${itemImage}
      <div class="${format}__content__body ${type}-body">
        ${body}
      </div>
    `;
  }
  // Clip content
  if (type === 'clip') {
    summary = marked(summary);
    itemContent = `
      <h4 class="${format}__content__title ${type}-title title"><a href="${url}" target="_blank">${title}<span class="linkout"></span></a></h4>
      <div class="${format}__content__body ${type}-body">
        ${summary}
      </div>
    `;
  }
  // Put it all together
  const item = `
    <article class="${format}">
      <header class="${format}__header">
        <p class="${format}__header__date">
          <time datetime="${datetime}"><a href="/feed/#/${slug}" class="${modalTrigger}">${friendlyDate}</a></time>
        </p>
        <p class="${format}__header__type ${type}-corner">
        <a href="/feed/category/#/${type}">${type}</a></p>
      </header>
      <div class="${format}__content content">
        ${itemContent}
      </div>
      ${tagChunk} 
    </article>
  `;
  return item;
};

module.exports = createItem;
