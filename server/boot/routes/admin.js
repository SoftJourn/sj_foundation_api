var express = require('express');
var router = express.Router();
var wpService = require('../../infrastructure/wp/wpService');
var lbService = require('../../infrastructure/lbService/lbService');


module.exports = function(app) {

  router.get('/', function (req, res) {
    res.send('Admin home page');
  });

  router.get('/wp', function (req, res) {
    wpService.getProjects().then(function(response) {
      lbService.updateProjects(app.models.Project, JSON.parse(response).data).then(function(result) {
        res.json(result);
      });
      res.json({});
    });
  });

  return router;
};