var request = require('request');
var express = require('express')
var router = express.Router();

module.exports = function(app) {

  router.get('/', function (req, res) {
    var Project = app.models.Project;
    Project.find({include: 'projectStats'}, function (err, projects) {
      res.json(projects);
    });
  });

  router.get('/:slug', function (req, res) {
    var Project = app.models.Project;
    Project.findOne({
      include: 'projectStats',
      where: {
        slug: req.params.slug
      }
    }, function (err, projects) {
      res.json(projects);
    });
  });

  return router;
};