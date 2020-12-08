const fs = require('fs');
const yaml = require('js-yaml');
const bookJSON = require('./books.json');

const yamlStr = yaml.safeDump(bookJSON);
fs.writeFileSync('books.yml', yamlStr, 'utf8');