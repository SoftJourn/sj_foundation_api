var express = require('express');
var router = express.Router();
var wpService = require('../../infrastructure/wp/wpService');
var lbService = require('../../infrastructure/lbService/lbService');


module.exports = function(app) {

  router.get('/', function (req, res) {
    res.send('Admin home page');
  });

  router.get('/wp/projects', function (req, res) {
    wpService.getProjects().then(function(response) {
      lbService.updateProjects(app.models.Project, JSON.parse(response).data).then(function(result) {
        res.json(result);
      });
      res.json({});
    });
  });

  router.get('/wp/comments', function (req, res) {
    app.models.Project.find({limit:1}, function(err, projects) {
      projects.map(function(project) {
        wpService.getComments(project.id).then(function(response) {
          lbService.updateComments(app.models.Project, project, JSON.parse(response)).then(function(result) {
            res.json(result);
          });
        });
      })
    });
  });

  return router;
};