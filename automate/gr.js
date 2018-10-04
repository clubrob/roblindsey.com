var request = require('request');
var convert = require('xml-js');

(function() {
  request(
    'https://www.goodreads.com/review/list/1665822.xml?key=AoMooNgSusmmmJbD1az9lg&v=2&shelf=read&sort=date_read&per_page=1',
    function(error, response, body) {
      var jsonString = convert.xml2json(body, { compact: true, spaces: 2 });
      var json = JSON.parse(jsonString).GoodreadsResponse.reviews;

      var book = {
        title: json.review.book.title._text,
        author: json.review.book.authors.author.name._text,
        isbn: json.review.book.isbn._text,
        rating: json.review.rating._text,
        dateRead: new Date(json.review.read_at._text),
      };

      console.log(book);
    }
  );
})();
