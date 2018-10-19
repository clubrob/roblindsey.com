const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const rp = require('request-promise');
const convert = require('xml-js');
const dayjs = require('dayjs');

// GoodReads Google Spreadsheet
const grSheetId = '1uGjK5SybdD46SzSEV-wi6-EhMNl0SbU3zQPFb8xqP9o';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), updateSheet);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          'Error while trying to retrieve access token',
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/* Get last date read */
function getLastDateRead() {
  let booksJSON = require('../src/_data/books.json');
  let dateRead = dayjs(booksJSON.read[0].books[0].dateRead).format(
    'YYYY/MM/DD'
  );
  return new Date(dateRead);
}

/* Get GoodReads Data */
function getGoodReadsData(lastDate) {
  function filterByDate(item) {
    let dateRead = dayjs(item.read_at._text).format('YYYY/MM/DD');
    let dateReadRounded = new Date(dateRead);
    return lastDate < dateReadRounded;
  }
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
          dateRead: dayjs(dateRead).format('YYYY/MM/DD'),
        };
      });

      return books;
    })
    .catch(err => console.log(err));
}

/* Update Google Sheet */
function updateSheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  const lastDate = getLastDateRead();
  getGoodReadsData(lastDate)
    .then(res => {
      return res.map(book => {
        return [book.title, book.author, book.isbn, book.rating, book.dateRead];
      });
    })
    .then(res => {
      return sheets.spreadsheets.values.append({
        spreadsheetId: grSheetId,
        range: '2018',
        valueInputOption: 'RAW',
        resource: {
          range: '2018',
          majorDimension: 'ROWS',
          values: res,
        },
      });
    })
    .then(() => {
      return sheets.spreadsheets.batchUpdate({
        spreadsheetId: grSheetId,
        resource: {
          requests: [
            {
              sortRange: {
                range: {
                  sheetId: 1849336083,
                  startRowIndex: 0,
                  startColumnIndex: 0,
                },
                sortSpecs: [
                  {
                    dimensionIndex: 4,
                    sortOrder: 'DESCENDING',
                  },
                ],
              },
            },
          ],
        },
      });
    })
    .then(() => {
      return sheets.spreadsheets.values.batchGet(
        {
          spreadsheetId: grSheetId,
          ranges: ['2018', '2017', '2016'],
        },
        (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);

          const rows = res.data.valueRanges;
          if (rows.length) {
            const years = rows.map(year => {
              let yearObj = {};
              yearObj.year = year.values[0][4].split('/')[0];
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
            const books = { read: years };
            const jsonString = JSON.stringify(books);
            fs.writeFile('../src/_data/books.json', jsonString, err => {
              if (err) {
                console.log(err);
              }
              console.log('Books datafile updated!');
            });
          }
        }
      );
    })
    .catch(err => console.log(err));
}
