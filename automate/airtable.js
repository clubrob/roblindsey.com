const fs = require('fs');
const Airtable = require('airtable');
// const readline = require('readline');
const rp = require('request-promise');
const convert = require('xml-js');
const dayjs = require('dayjs');

const base = new Airtable({
  apiKey: 'keyeI4KpmDoSQWmcp',
}).base('appuDlLSTTQKBT7BO');

// Helper function for getting date of last book in books.json
function getLastDateRead() {
  let booksJSON = require('../src/_data/books.json');
  let dateRead = dayjs(booksJSON.read[0].books[0].dateRead).format(
    'YYYY-MM-DD'
  );
  return new Date(dateRead);
}

/* Get GoodReads Data */
function getGoodReadsData(lastDate) {
  // Filter function for array filter
  function filterByDate(item) {
    let dateRead = dayjs(item.read_at._text).format('YYYY-MM-DD');
    let dateReadRounded = new Date(dateRead);
    return lastDate < dateReadRounded;
  }
  // Returns promise
  return rp(
    'https://www.goodreads.com/review/list/1665822.xml?key=AoMooNgSusmmmJbD1az9lg&v=2&shelf=read&sort=date_read&per_page=10'
  )
    .then(body => {
      var jsonString = convert.xml2json(body, { compact: true, spaces: 2 });
      var json = JSON.parse(jsonString).GoodreadsResponse.reviews.review;

      var booksRaw = json.filter(filterByDate);
      var books = booksRaw.map(review => {
        var dateRead = new Date(review.read_at._text);
        return {
          title: review.book.title._text,
          author: review.book.authors.author.name._text,
          isbn: review.book.isbn._text,
          rating: review.rating._text,
          date_read: dayjs(dateRead).format('YYYY-MM-DD'),
        };
      });

      return books;
    })
    .catch(err => console.log(err));
}

// Add record to Airtable
function addToTable(booksBase, booksArray) {
  return booksArray.forEach(book => {
    booksBase('ratings').create(
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        rating: Number(book.rating),
        date_read: book.date_read,
      },
      function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(record.getId());
      }
    );
  });
}

// Get records from Airtable
function getTableRecords(booksBase) {
  let recordSet = [];
  /* const processPage = (someRecords, fetchNextPage) => {
    recordSet = [...recordSet, ...someRecords];
    fetchNextPage();
  };
  const processRecords = err => {
    if (err) {
      console.error(err);
      return;
    }
    const books = recordSet.map(record => {
      return record.fields;
    });
    const bdoasf = books.map(book => {
      return dayjs(book.date_read).format('YYYY');
    });
    bdoasf;
  }; */
  // Returns promise
  booksBase('ratings')
    .select({
      view: 'Last three years',
      pageSize: 10,
      sort: [
        {
          field: 'date_read',
          direction: 'desc',
        },
      ],
    })
    //.eachPage(processPage, processRecords);
    .eachPage(
      function page(records, fetchNextPage) {
        recordSet = [...recordSet, ...records];
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
        const temp = recordSet.map(record => {
          return record.fields;
        });
        const years = temp.map(t => {
          return dayjs(t.date_read).format('YYYY');
        });
        console.log([...new Set(years)]);
      }
    );
}

// Write books.json data file
function writeBooksJSON(sheetData) {
  const rowsArray = sheetData.data.valueRanges;
  // Map array by years
  const years = rowsArray.map(year => {
    let yearObj = {};
    // Grab year value for keys in new array
    yearObj.year = year.values[0][4].split('/')[0];
    // Map books to year arrays
    yearObj.books = year.values.map(row => {
      return {
        title: row[0],
        author: row[1],
        isbn: row[2],
        rating: row[3],
        dateRead: row[4],
      };
    });
    return yearObj;
  });
  // Add years arrays to books object
  const books = { read: years };
  const jsonString = JSON.stringify(books);

  // Write JSON file
  fs.writeFile('../src/_data/books.json', jsonString, err => {
    if (err) {
      console.log(err);
    }
    console.log('Books datafile updated!');
  });
}

// Run update algorithm
function updateTable(booksBase) {
  // const lastDate = getLastDateRead();
  // const lastDate = new Date('2018-11-28');
  // getGoodReadsData(lastDate)
  // .then(res => {
  //   return addToTable(booksBase, res);
  // })
  // .then(() => {
  //   return getTableRecords(booksBase);
  // })
  // .then(res => {
  //   return writeBooksJSON(res);
  // })
  //.catch(err => console.error(err.message));
  getTableRecords(booksBase);
}

updateTable(base);
