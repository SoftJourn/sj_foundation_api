var request = require('request');
var express = require('express');
var router = express.Router();

module.exports = function(app) {

  router.get('/', function (req, res) {
      res.json([
        {
          name: 'office',
          slug: 'office',
        },
        {
          name: 'social',
          slug: 'social',
        },
        {
          name: 'health',
          slug: 'health',
        }
      ]);
  });

  return router;
};