const fs = require('fs');
const rp = require('request-promise');
const convert = require('xml-js');
const dayjs = require('dayjs');

/* Get GoodReads Data */
function getGoodReadsData() {
  // Returns promise
  return rp(
    'https://www.goodreads.com/review/list/1665822.xml?key=AoMooNgSusmmmJbD1az9lg&v=2&shelf=read&sort=date_read&per_page=150'
  )
    .then(body => {
      var jsonString = convert.xml2json(body, { compact: true, spaces: 2 });
      var booksRaw = JSON.parse(jsonString).GoodreadsResponse.reviews.review;

      var books = [];
      var bookIndex = 0;

      for (let index = 0; index < booksRaw.length; index++) {
        var book = booksRaw[index];
        var dateRead = new Date(book.read_at._text);
        var yearRead = dayjs(dateRead).format('YYYY');

        var bookObj = {
          title: book.book.title._text,
          author: book.book.authors.author.name._text,
          isbn: book.book.isbn._text,
          rating: book.rating._text,
          imgUrl: book.book.image_url._text,
          dateRead: dayjs(dateRead).format('YYYY/MM/DD')
        };

        if (books[bookIndex] === undefined) {
          books[bookIndex] = {};
          books[bookIndex].year = yearRead;
          books[bookIndex].books = [];
          books[bookIndex].books.push(bookObj);
        } else if (books[bookIndex].year === yearRead) {
          books[bookIndex].books.push(bookObj);
        } else if (books[bookIndex].year !== yearRead) {
          if (bookIndex < 2) { // Limits to three years
            bookIndex++;
            books[bookIndex] = {};
            books[bookIndex].year = yearRead;
            books[bookIndex].books = [];
            books[bookIndex].books.push(bookObj);
          }
        }
      }
      // console.log(JSON.stringify(books));
      return JSON.stringify(books);
    })
    .catch(err => console.log(err));
}

function writeBooksJSON(jsonString) {
  // Write JSON file
  fs.writeFile('../../src/_data/books.json', jsonString, err => {
    if (err) {
      console.log(err);
    }
    console.log('Books datafile updated!');
  });
}

function updateBooks() {
  getGoodReadsData()
    .then(res => {
      return writeBooksJSON(res);
    })
    .catch(err => console.log(err));
}

updateBooks();
