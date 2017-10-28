var request = require('request');

function getProjects() {
  return new Promise(function(resolve, reject) {
    request({uri: 'https://sj-foundation.softjourn.if.ua/wp-json/wp/v2/get_projects/'},
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
  });
}


module.exports = {
  getProjects: getProjects
};