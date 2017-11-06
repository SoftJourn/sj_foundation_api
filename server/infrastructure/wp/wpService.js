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

function getComments(projectId) {
  return new Promise(function(resolve, reject) {
    request({uri: 'https://sj-foundation.softjourn.if.ua/wp-json/wp/v2/comments?per_page=100&post='+projectId},
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
  });
}

// https://sj-foundation.softjourn.if.ua/wp-json/wp/v2/comments?per_page=100&post=980

module.exports = {
  getProjects: getProjects,
  getComments: getComments,
};