var request = require('request');
var express = require('express')
var router = express.Router();

module.exports = function(app) {

  router.get('/', function (req, res) {
    var Project = app.models.Project;
    var where = {};
    if (!!req.query.category) {
      where.category = req.query.category
    }
    Project.find({
      include: ['projectStats'],
      where: where,
    }, function (err, projects) {
      res.json(projects);
    });
  });

  router.get('/:id', function (req, res) {
    var Project = app.models.Project;
    Project.findOne({
      include: ['projectStats', 'comments'],
      where: {
        id: req.params.id
      }
    }, function (err, projects) {
      res.json(projects);
    });
  });

  return router;
};