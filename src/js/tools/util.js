const firstLetterToUpper = function(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

const fetchHelper = function(baseUrl, endpoint) {
  return fetch(baseUrl + endpoint)
    .then(res => {
      return res.json();
    })
    .catch(err => console.error(err.message));
};

module.exports = { firstLetterToUpper, fetchHelper };
