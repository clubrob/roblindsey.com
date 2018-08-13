const { firstLetterToUpper } = require('../tools/util');

const feedView = {
  feedListHeader: function() {
    return `<h1 class="title feed__title">Feed.</h1>`;
  },
  itemHeader: function(title) {
    return `<h1 class="title feed__title">${title}.</h1>`;
  },
  tagListHeader: function(tag) {
    return `<h1 class="title feed__title">Tag: ${tag}.</h1>`;
  },
  categoryListHeader: function(category) {
    category = firstLetterToUpper(category);
    return `<h1 class="title feed__title">${category}s.</h1>`;
  },
  pagination: function(data) {
    let prev = data.previous;
    let next = data.next;
    let type = data.type;

    return `
      <div class="pagination">
        <a href="#" data-page="${prev}" data-type="${type}" class="pagination__previous" id="page_previous">Previous</a>
        <a href="#" data-page="${next}" data-type="${type}" class="pagination__next" id="page_next">Next</a>
      </div>
    `;
  },
};

module.exports = feedView;
