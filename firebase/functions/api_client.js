const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';

function callAPI(url, query) {
  return axios({
    method: 'post',
    url: url,
    responseType: 'json',
    data: query
  })
}

module.exports = callAPI;
