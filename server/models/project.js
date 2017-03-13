'use strict';

module.exports = function(Project) {
  Project.projectStats = function(cb) {
    Project.find({include: 'transactions'}, function (err, projects) {
      projects.forEach(function(projects) {
        console.log(projects);
      });
    });
    cb(null, 'ok');
  };

  Project.remoteMethod('projectStats', {
    http: {path: '/stats', verb: 'get'},
    returns: [
      {arg: 'all', type: 'number'},
      {arg: 'active', type: 'number'},
      {arg: 'win', type: 'number'},
      {arg: 'lost', type: 'number'}
    ]
  });
};
