const endpoint =
  'https://us-central1-roblindseydesign.cloudfunctions.net/rldesign/';

fetch(endpoint + 'feed')
  .then(res => {
    return res.json();
  })
  .then(res => {
    return console.log(res);
  })
  .catch(err => console.error(err.message));
