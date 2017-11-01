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

  router.get('/:id', function (req, res) {
    var Project = app.models.Project;
    Project.findOne({
      include: 'projectStats',
      where: {
        id: req.params.id
      }
    }, function (err, projects) {
      res.json(projects);
    });
  });

  return router;
};